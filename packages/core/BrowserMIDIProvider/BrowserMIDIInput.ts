import type { MIDIInput, MIDIEventTypes, MIDIEventName } from "../interfaces/MIDIProvider"

export class BrowserMIDIInput implements MIDIInput {
    constructor(public name: string, private input: WebMidi.MIDIInput) {
        this.attachHandlers()
    }

    private attachHandlers() {
        this.input.addEventListener('midimessage', (event) => {
            console.log('midimessage', event)
        })
    }

    on<T extends MIDIEventName>(event: T, callback: (data: MIDIEventTypes[T]) => void) {

    }

    off<T extends MIDIEventName>(event: T, callback: (data: MIDIEventTypes[T]) => void) {

    }

    setChannel(channel: number) {

    }

}