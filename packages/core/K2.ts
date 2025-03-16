import type { Channel } from "./types";
import mitt, { type Emitter, type Handler } from "mitt";
import { buttons, type Button, type StrippedButton } from "./controlls";

type ButtonEvents = {
    'button.press': StrippedButton;
    'button.release': StrippedButton;
};

type Events = {
    connect: void
    connectionError: unknown
} & ButtonEvents;

type EventNames = keyof Events

export class K2 {
    private emitter: Emitter<Events>
    private input?: WebMidi.MIDIInput
    private output?: WebMidi.MIDIOutput

    constructor(private channel: Channel) {
        this.emitter = mitt()
    }

    async connect(): Promise<void> {
        try {
            const midiAccess = await navigator.requestMIDIAccess()
            const input = Array.from(midiAccess.inputs.values()).find(item => item.name === 'XONE:K2')
            const output = Array.from(midiAccess.outputs.values()).find(item => item.name === 'XONE:K2')

            if (input && output) {
                this.input = input;
                this.output = output;
                this.attachEvents()
                this.emitter.emit('connect')
            } else {
                this.emitter.emit('connectionError', new Error(`XONE:K2 not found`))
            }

        } catch (error) {
            console.log('Error connecting to K2', error)
            this.emitter.emit('connectionError', error)
        }
    }

    on<T extends EventNames>(event: T, callback: Handler<Events[T]>): void {
        this.emitter.on(event, callback)
    }

    attachEvents() {
        console.log('attaching events')

        if (this.input) {
            this.input.addEventListener('midimessage', (e) => {
                console.log('midimessage', e, JSON.stringify(e.data))

                const button = buttons.find(b => b.midi === e.data[1]);

                if (button) {
                    const strippedButton = this.stripButton(button)
                    this.emitter.emit('button.press', strippedButton)

                    if (e.data[2] === 127) {
                        this.emitter.emit('button.press', strippedButton);
                    }

                    if (e.data[2] === 0) {
                        this.emitter.emit('button.release', strippedButton);
                    }
                }
            })
        }
    }

    private stripButton(button: Button) {
        return {
            name: button.name,
            midi: button.midi,
        }
    }
}   