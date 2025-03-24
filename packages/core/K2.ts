import type { Channel } from "./types";
import mitt, { type Emitter, type Handler } from "mitt";
import { buttons, type Button, type StrippedButton, type Color, type ButtonName, faders, controls, getButtonByMidi, type LedName, getLedByName } from "./controlls";
import type { MIDIInput, MIDIOutput, MIDIProvider } from "./interfaces/MIDIProvider";

export type KnobEvent = { name: string, value: number }
export type FaderEvent = { name: string, value: number }
export type EncoderEvent = { name: string, value: -1 | 1 }

type ButtonEvents = {
    'button.press': StrippedButton;
    'button.release': StrippedButton;
    'fader.change': FaderEvent;
    'knob.change': KnobEvent;
    'encoder.turn': EncoderEvent;
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

            console.log({ input, output })

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
            console.log('Error connecting to K2', error)
            this.state = K2State.Error
            this.emitter.emit('connectionError', error)
        }
    }

    on<T extends EventNames>(event: T, callback: Handler<Events[T]>): void {
        this.emitter.on(event, callback)
    }

    private attachInputEvents() {
        if (this.input) {

            this.input.on('note.on', ({ note, velocity }) => {
                const button = getButtonByMidi(note);

                if (button) {
                    this.emitter.emit('button.press', button);
                }
            })

            this.input.on('note.off', ({ note, velocity }) => {
                const button = getButtonByMidi(note);

                if (button) {
                    this.emitter.emit('button.release', button);
                }
            })

            this.input.on('control.change', ({ cc, value }) => {
                const control = controls.find(c => c.cc === cc);
                const maxValue = 127


                if (control?.name.includes('fader')) {
                    this.emitter.emit('fader.change', { name: control.name, value: value / maxValue });
                }

                if (control?.name.includes('knob')) {
                    this.emitter.emit('knob.change', { name: control.name, value: value / maxValue });
                }

                if (control?.name.includes('encoder')) {
                    this.emitter.emit('encoder.turn', { name: control.name, value: value === maxValue ? 1 : -1 });
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