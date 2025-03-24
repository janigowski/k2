import type { Channel } from "./types";
import mitt, { type Emitter, type Handler } from "mitt";
import { type Button, type Color, getButtonByMidi, type LedName, getLedByName, getControlByControlChange, type Knob, type Fader, type Encoder } from "./controlls";
import type { MIDIInput, MIDIOutput, MIDIProvider } from "./interfaces/MIDIProvider";

export type ButtonEvent = Button
export type EncoderEvent = { name: Encoder['name'], value: -1 | 1 }
export type FaderEvent = { name: Fader['name'], value: number }
export type KnobEvent = { name: Knob['name'], value: number }

type ButtonEvents = {
    'button.press': ButtonEvent;
    'button.release': ButtonEvent;
    'encoder.turn': EncoderEvent;
    'fader.change': FaderEvent;
    'knob.change': KnobEvent;
};

type Events = {
    connect: void
    connectionError: unknown
} & ButtonEvents;

type EventNames = keyof Events

export enum K2State {
    Disconnected = 'disconnected',
    Connecting = 'connecting',
    Connected = 'connected',
    Error = 'error'
}

export class K2 {
    private emitter: Emitter<Events>
    private input?: MIDIInput
    private output?: MIDIOutput
    private state: K2State = K2State.Disconnected
    public debug = false

    constructor(private channel: Channel, public provider: MIDIProvider) {
        this.emitter = mitt()
    }

    getState(): K2State {
        return this.state
    }

    async connect(): Promise<void> {
        if (this.state === K2State.Connecting || this.state === K2State.Connected) {
            return
        }

        this.state = K2State.Connecting

        try {
            const input = this.provider.getInput({ name: 'XONE:K2', channel: this.channel })
            const output = this.provider.getOutput({ name: 'XONE:K2', channel: this.channel })

            if (input) {
                this.input = input
                this.attachInputEvents()
                this.state = K2State.Connected
                this.emitter.emit('connect')
            }

            if (output) {
                this.output = output
            }
        } catch (error) {
            this.state = K2State.Error
            this.emitter.emit('connectionError', error)
        }
    }

    on<T extends EventNames>(event: T, callback: Handler<Events[T]>): void {
        this.emitter.on(event, callback)
    }

    private attachInputEvents() {
        if (this.input) {
            this.input.on('note.on', ({ note }) => {
                const button = getButtonByMidi(note);

                if (button) {
                    this.emitter.emit('button.press', button);
                }
            })

            this.input.on('note.off', ({ note }) => {
                const button = getButtonByMidi(note);

                if (button) {
                    this.emitter.emit('button.release', button);
                }
            })

            this.input.on('control.change', ({ cc, value }) => {
                const control = getControlByControlChange(cc);
                const maxValue = 127

                if (control) {
                    const { name, type } = control
                    const normalized = value / maxValue

                    switch (type) {
                        case 'encoder':
                            const direction = value === maxValue ? 1 : -1
                            this.emitter.emit('encoder.turn', { name, value: direction });
                            break;

                        case 'fader':
                            this.emitter.emit('fader.change', { name, value: normalized });
                            break;

                        case 'knob':
                            this.emitter.emit('knob.change', { name, value: normalized });
                            break;
                    }
                } else {
                    if (this.debug) {
                        // @TODO: use debug
                        console.log('Control does not exist: ', { cc, value });
                    }
                }
            })
        }
    }

    highlightLED(name: LedName, color: Color) {
        const led = getLedByName(name)

        if (!led) {
            console.error(`LED ${name} not found`);
            return;
        }

        const maxVelocity = 127
        this.output?.sendNoteOn(led[color], maxVelocity);
    }

    unhighlightLED(name: LedName) {
        const led = getLedByName(name);

        if (!led) {
            console.error(`LED ${name} not found`);
            return;
        }

        const anyColor = 'green'
        this.output?.sendNoteOff(led[anyColor]);
    }
}   