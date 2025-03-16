import type { Channel } from "./types";
import mitt, { type Emitter, type Handler } from "mitt";
import { buttons } from "./controlls";

type Events = {
    connect: void
    connectionError: unknown
    'exit-setup.press': void
}

type EventNames = keyof Events

export class K2 {
    private emitter: Emitter<Events>

    constructor(private channel: Channel) {
        this.emitter = mitt()
    }

    async connect(): Promise<void> {
        try {


            if (input && output) {


                if (this.inputChannel && this.outputChannel) {
                    this.emitter.emit('connect')

                    this.attachEvents()
                } else {
                    console.log(`XONE:K2 Channel ${this.channel} not found`)
                    this.emitter.emit('connectionError', new Error(`XONE:K2 Channel ${this.channel} not found`))
                }
            } else {
                console.log(`XONE:K2 not found on channel ${this.channel}`)
                this.emitter.emit('connectionError', new Error(`XONE:K2 not found on channel ${this.channel}`))
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

        if (this.inputChannel) {
            this.inputChannel.addListener('noteon', (e) => {
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