import mitt, { type Emitter } from "mitt"
// import debug from 'debug'

import type { MIDIOutput, MIDIEventTypes, MIDIEventName } from "../interfaces/MIDIProvider"
// const log = debug('browser-midi-input')

export class BrowserMIDIOutput implements MIDIOutput {
    constructor(public name: string, public channel: number, private output: WebMidi.MIDIOutput) {
    }

    setChannel(channel: number): void {

    }

    sendNoteOn(note: string, velocity: number): void {

    }

    sendNoteOff(note: string): void {
        //     const channel = (midiEvent[0] & 0x0F) + 1
        // const typeId = midiEvent[0] & 0xF0
        // const data = midiEvent[1]

        // this.output.send([])

    }

    // parseMessage(midiEvent: Uint8Array): ParsedEvent | null {
    //     const channel = (midiEvent[0] & 0x0F) + 1
    //     const typeId = midiEvent[0] & 0xF0
    //     const data = midiEvent[1]

    //     const typeMap: Record<number, { type: MIDIEventName, data: MIDIEventTypes[MIDIEventName] }> = {
    //         0x90: {
    //             type: 'note.on',
    //             data: {
    //                 note: data,
    //                 velocity: midiEvent[2]
    //             }
    //         },
    //         0x80: {
    //             type: 'note.off',
    //             data: {
    //                 note: data,
    //                 velocity: midiEvent[2]
    //             }
    //         },
    //         0xB0: {
    //             type: 'control.change',
    //             data: {
    //                 cc: data,
    //                 value: midiEvent[2]
    //             }
    //         },
    //         0xC0: {
    //             type: 'program.change',
    //             data: {
    //                 program: data
    //             }
    //         }
    //     }

    //     const type = typeMap[typeId]

    //     if (type) {
    //         return {
    //             channel,
    //             type: type.type,
    //             data: type.data
    //         }
    //     }

    //     return null
    // }

}