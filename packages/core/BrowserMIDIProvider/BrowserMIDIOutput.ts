import mitt, { type Emitter } from "mitt"
// import debug from 'debug'

import type { MIDIOutput } from "../interfaces/MIDIProvider"
import { noteToMIDINumber } from "./notes"
// const log = debug('browser-midi-input')

export class BrowserMIDIOutput implements MIDIOutput {
    constructor(public name: string, public channel: number, private output: WebMidi.MIDIOutput) {
    }

    sendNoteOn(note: number | string, velocity: number): void {
        const statusByte = 0x90 | (this.channel - 1)

        const noteNumber = typeof note === 'string' ? noteToMIDINumber(note) : note

        this.output.send([statusByte, noteNumber, velocity])
    }

    sendNoteOff(note: number | string, velocity: number): void {
        const statusByte = 0x80 | (this.channel - 1)

        if (typeof note === 'string') {
            note = noteToMIDINumber(note)
        }

        this.output.send([statusByte, note, velocity])
    }
}