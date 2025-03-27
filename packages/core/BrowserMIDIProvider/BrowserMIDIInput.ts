import mitt, { type Emitter } from "mitt"
// import debug from 'debug'

import type { MIDIInput, MIDIEventTypes, MIDIEventName } from "../interfaces/MIDIProvider"
// const log = debug('browser-midi-input')

type ParsedEvent = {
    channel: number,
    type: MIDIEventName,
    data: MIDIEventTypes[MIDIEventName]
}

export class BrowserMIDIInput implements MIDIInput {
    private emitter: Emitter<MIDIEventTypes>

    constructor(public name: string, public channel: number, private input: WebMidi.MIDIInput) {
        this.emitter = mitt()
        this.attachHandlers()
    }

    private attachHandlers() {
        this.input.addEventListener('midimessage', (event) => {
            const parsedEvent = this.parseMessage(event.data)

            if (this.channel === parsedEvent?.channel) {
                this.emitter.emit(parsedEvent.type, parsedEvent.data)
            }
        })
    }

    on<T extends MIDIEventName>(event: T, callback: (data: MIDIEventTypes[T]) => void) {
        this.emitter.on(event, callback)
    }

    off<T extends MIDIEventName>(event: T, callback: (data: MIDIEventTypes[T]) => void) {
        this.emitter.off(event, callback)
    }

    parseMessage(midiEvent: Uint8Array): ParsedEvent | null {
        const channel = (midiEvent[0] & 0x0F) + 1
        const typeId = midiEvent[0] & 0xF0
        const data = midiEvent[1]

        const typeMap: Record<number, { type: MIDIEventName, data: MIDIEventTypes[MIDIEventName] }> = {
            0x90: {
                type: 'note.on',
                data: {
                    note: data,
                    velocity: midiEvent[2]
                }
            },
            0x80: {
                type: 'note.off',
                data: {
                    note: data,
                    velocity: midiEvent[2]
                }
            },
            0xB0: {
                type: 'control.change',
                data: {
                    cc: data,
                    value: midiEvent[2]
                }
            },
            0xC0: {
                type: 'program.change',
                data: {
                    program: data
                }
            }
        }

        const type = typeMap[typeId]

        if (type) {
            return {
                channel,
                type: type.type,
                data: type.data
            }
        }

        return null
    }
}