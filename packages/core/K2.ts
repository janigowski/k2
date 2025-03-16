import type { Channel } from "./types";
import mitt, { type Emitter, type Handler } from "mitt";
import { buttons, type Button } from "./controlls";

type ButtonEvents = {
    [K in Button['name']as `${K}.press`]: Button;
};

type Events = {
    connect: void
    connectionError: unknown
} & ButtonEvents;

type EventNames = keyof Events

export class K2 {
    private emitter: Emitter<Events>
    private inputChannel: any; // Using any temporarily to fix the linter error
    private outputChannel: any; // Using any temporarily to fix the linter error

    constructor(private channel: Channel) {
        this.emitter = mitt()
    }

    async connect(): Promise<void> {
        try {
            const midiAccess = await navigator.requestMIDIAccess()

            const input = Array.from(midiAccess.inputs.values()).find(item => item.name === 'XONE:K2')
            const output = Array.from(midiAccess.outputs.values()).find(item => item.name === 'XONE:K2')

            console.log({ input, output, inputs: Array.from(midiAccess.inputs.values()), outputs: Array.from(midiAccess.outputs.values()) })

            if (input && output) {
                this.inputChannel = input;
                this.outputChannel = output;
                this.emitter.emit('connect')
            }


            // if (input && output) {


            //     if (this.inputChannel && this.outputChannel) {

            //         this.attachEvents()
            //     } else {
            //         console.log(`XONE:K2 Channel ${this.channel} not found`)
            //         this.emitter.emit('connectionError', new Error(`XONE:K2 Channel ${this.channel} not found`))
            //     }
            // } else {
            //     console.log(`XONE:K2 not found on channel ${this.channel}`)
            //     this.emitter.emit('connectionError', new Error(`XONE:K2 not found on channel ${this.channel}`))
            // }
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

        if (this.inputChannel) {
            this.inputChannel.addListener('noteon', (e: { note: { number: number } }) => {
                console.log('noteon', e)

                const button = buttons.find(b => b.midi === e.note.number);

                if (button) {
                    const eventName = button.name + '.press' as keyof Events

                    this.emitter.emit(eventName, button);
                }
            })
        }
    }
}   