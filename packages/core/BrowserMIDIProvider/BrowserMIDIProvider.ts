import type { MIDIEventName, MIDIEventTypes, MIDIIdentifierOptions, MIDIInput, MIDIOutput, MIDIProvider } from "../interfaces/MIDIProvider";

export class BrowserMIDIProvider implements MIDIProvider {
    private midiAccess: WebMidi.MIDIAccess | null = null
    private inputs: Record<string, MIDIInput> = {}
    private outputs: Record<string, MIDIOutput> = {}

    constructor() {

    }

    async connect() {
        this.midiAccess = await navigator.requestMIDIAccess()
        const input = Array.from(midiAccess.inputs.values()).find(item => item.name === 'XONE:K2')
        const output = Array.from(midiAccess.outputs.values()).find(item => item.name === 'XONE:K2')
    }

    async disconnect() {
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

export class BrowserMIDIOutput implements MIDIOutput {
    constructor(public name: string, private readonly output: MIDIAccess) {

    }

    setChannel(channel: number) {

    }

    send(data: number[]) {

    }

    sendNoteOn(note: string, velocity: number) {

    }

    sendNoteOff(note: string) {

    }

}
