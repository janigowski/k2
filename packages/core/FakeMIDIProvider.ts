import mitt, { type Emitter } from "mitt";
import type { MIDIInput, MIDIOutput, MIDIProvider, MIDIIdentifierOptions, MIDIEventName, MIDIEventTypes } from "./interfaces/MIDIProvider";

export class FakeMIDIProvider implements MIDIProvider {
    private inputs: Record<string, MIDIInput> = {}
    private outputs: Record<string, MIDIOutput> = {}

    constructor() {

    }

    connect(): Promise<void> {
        return Promise.resolve()
    }

    disconnect(): Promise<void> {
        return Promise.resolve()
    }

    getInput(options: MIDIIdentifierOptions): MIDIInput | undefined {
        const key = this.getInputKey(options)
        return this.inputs[key]
    }

    getOutput(options: MIDIIdentifierOptions): MIDIOutput | undefined {
        const key = this.getInputKey(options)
        return this.outputs[key]
    }


    setInput(options: MIDIIdentifierOptions, input: MIDIInput) {
        const key = this.getInputKey(options)
        this.inputs[key] = input
    }

    setOutput(options: MIDIIdentifierOptions, output: MIDIOutput) {
        const key = this.getInputKey(options)
        this.outputs[key] = output
    }

    private getInputKey(options: MIDIIdentifierOptions): string {
        return `${options.name}-${options.channel}`
    }
}

export class FakeMIDIInput implements MIDIInput {
    public channel: number = 0
    private emitter: Emitter<MIDIEventTypes>

    constructor(public name: string) {
        this.emitter = mitt()
    }

    setChannel(channel: number): void {
        this.channel = channel
    }

    on<T extends MIDIEventName>(event: T, callback: (data: MIDIEventTypes[T]) => void): void {
        this.emitter.on(event, callback)
    }

    off<T extends MIDIEventName>(event: T, callback: (data: MIDIEventTypes[T]) => void): void {
        this.emitter.off(event, callback)
    }

    emit<T extends MIDIEventName>(event: T, data: MIDIEventTypes[T]): void {
        this.emitter.emit(event, data)
    }
}

export class FakeMIDIOutput implements MIDIOutput {
    private channel: number = 0

    constructor(public name: string) {
    }

    setChannel(channel: number): void {
        this.channel = channel
    }

    sendNoteOn(note: string, velocity: number): void {
    }

    sendNoteOff(note: string): void {
    }
}