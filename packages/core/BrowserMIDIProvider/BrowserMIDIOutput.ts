import type { MIDIOutput } from "../interfaces/MIDIProvider"
import { noteToMIDINumber } from "./notes"
import debug from 'debug'

const log = debug('browser-midi-output')

export class BrowserMIDIOutput implements MIDIOutput {
    constructor(public name: string, public channel: number, private output: WebMidi.MIDIOutput) {
    }

    sendNoteOn(note: number | string, velocity: number): void {
        const statusByte = 0x90 | (this.channel - 1)
        const noteNumber = typeof note === 'string' ? noteToMIDINumber(note) : note

        log('sendNoteOn', statusByte, note, noteNumber, velocity)

        this.output.send([statusByte, noteNumber, velocity])
    }

    sendNoteOff(note: number | string, velocity: number): void {
        const statusByte = 0x80 | (this.channel - 1)
        const noteNumber = typeof note === 'string' ? noteToMIDINumber(note) : note

        log('sendNoteOff', statusByte, note, noteNumber, velocity)

        this.output.send([statusByte, noteNumber, velocity])
    }
}