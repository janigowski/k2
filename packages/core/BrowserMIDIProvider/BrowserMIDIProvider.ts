import type { MIDIEventName, MIDIEventTypes, MIDIIdentifierOptions, MIDIInput, MIDIOutput, MIDIProvider } from "../interfaces/MIDIProvider";
import { BrowserMIDIInput } from "./BrowserMIDIInput";
import { BrowserMIDIOutput } from "./BrowserMIDIOutput";

export class BrowserMIDIProvider implements MIDIProvider {
    private midiAccess!: WebMidi.MIDIAccess
    private inputs: Record<string, MIDIInput> = {}
    private outputs: Record<string, MIDIOutput> = {}

    constructor() {
    }

    async connect() {
        this.midiAccess = await navigator.requestMIDIAccess()

        if (!this.midiAccess) {
            throw new Error('MIDI access not granted')
        }
    }

    async disconnect() {
    }

    getInput(options: MIDIIdentifierOptions): MIDIInput | undefined {
        const key = this.getPortKey(options)

        if (!this.inputs[key]) {
            const input = Array.from(this.midiAccess.inputs.values()).find(item => item.name === options.name)

            if (input) {
                this.setInput(options, new BrowserMIDIInput(options.name || 'Unknown', options.channel, input))
            }
        }

        return this.inputs[key]
    }

    getOutput(options: MIDIIdentifierOptions): MIDIOutput | undefined {
        const key = this.getPortKey(options)

        if (!this.outputs[key]) {
            const output = Array.from(this.midiAccess.outputs.values()).find(item => item.name === options.name)

            if (output) {
                this.setOutput(options, new BrowserMIDIOutput(options.name || 'Unknown', options.channel, output))
            }
        }

        return this.outputs[key]
    }

    setInput(options: MIDIIdentifierOptions, input: MIDIInput) {
        const key = this.getPortKey(options)
        this.inputs[key] = input
    }

    setOutput(options: MIDIIdentifierOptions, output: MIDIOutput) {
        const key = this.getPortKey(options)
        this.outputs[key] = output
    }

    private getPortKey(options: MIDIIdentifierOptions): string {
        return `${options.name}-${options.channel}`
    }

}
