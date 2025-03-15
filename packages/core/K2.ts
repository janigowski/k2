import type { Channel } from "./types";
import mitt, { type Emitter, type Handler } from "mitt";
import { WebMidi, type Input, type Output, type InputChannel, type OutputChannel } from "webmidi";

type Events = {
    connect: void
    connectionError: unknown
}

type EventNames = keyof Events

export class K2 {
    private emitter: Emitter<Events>
    private inputChannel: InputChannel
    private outputChannel: OutputChannel

    constructor(private channel: Channel) {
        this.emitter = mitt()
    }

    async connect(): Promise<void> {
        try {
            await WebMidi.enable()
            const input = WebMidi.getInputByName('XONE:K2')
            const output = WebMidi.getOutputByName('XONE:K2')

            console.log({ input, output })

            if (input && output) {
                this.inputChannel = input.channels[this.channel]
                this.outputChannel = output.channels[this.channel]
                this.emitter.emit('connect')
            } else {
                this.emitter.emit('connectionError', new Error('XONE:K2 not found'))
            }
        } catch (error) {
            this.emitter.emit('connectionError', error)
        }
    }

    on<T extends EventNames>(event: T, callback: Handler<Events[T]>): void {
        this.emitter.on(event, callback)
    }
}   