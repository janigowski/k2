import type { Channel } from "./types";
import mitt, { type Emitter, type Handler } from "mitt";
import { buttons, type Button, type StrippedButton, type Color, type ButtonName } from "./controlls";
import type { MIDIInput, MIDIProvider } from "./interfaces/MIDIProvider";
type ButtonEvents = {
    'button.press': StrippedButton;
    'button.release': StrippedButton;
};

type Events = {
    connect: void
    connectionError: unknown
} & ButtonEvents;

type EventNames = keyof Events

export class K2 {
    private emitter: Emitter<Events>
    private input?: WebMidi.MIDIInput
    private output?: WebMidi.MIDIOutput
    private inputNew?: MIDIInput


    constructor(private channel: Channel, public provider?: MIDIProvider) {
        this.emitter = mitt()

    }

    async connect(): Promise<void> {
        try {
            const midiAccess = await navigator.requestMIDIAccess()
            const input = Array.from(midiAccess.inputs.values()).find(item => item.name === 'XONE:K2')
            const output = Array.from(midiAccess.outputs.values()).find(item => item.name === 'XONE:K2')

            const inputNew = this.provider?.getInput({ name: 'XONE:K2', channel: this.channel })

            if (inputNew) {
                this.inputNew = inputNew
                this.attachEventsNew()
                this.emitter.emit('connect')
            } else {
                if (input && output) {
                    this.input = input;
                    this.output = output;
                    this.attachEvents()
                    this.emitter.emit('connect')
                } else {
                    this.emitter.emit('connectionError', new Error(`XONE:K2 not found`))
                }
            }
        } catch (error) {
            console.log('Error connecting to K2', error)
            this.emitter.emit('connectionError', error)
        }
    }

    on<T extends EventNames>(event: T, callback: Handler<Events[T]>): void {
        this.emitter.on(event, callback)
    }

    attachEventsNew() {
        if (this.inputNew) {

            this.inputNew.on('note.on', ({ note, velocity }) => {
                const button = buttons.find(b => b.midi === note);

                if (button) {
                    const strippedButton = this.stripButton(button)

                    if (velocity === 127) {
                        this.emitter.emit('button.press', strippedButton);
                    }

                    if (velocity === 0) {
                        this.emitter.emit('button.release', strippedButton);
                    }
                }
            })
        }
    }

    attachEvents() {
        console.log('attaching events')

        if (this.input) {
            this.input.addEventListener('midimessage', (e) => {
                const button = buttons.find(b => b.midi === e.data[1]);

                if (button) {
                    const strippedButton = this.stripButton(button)
                    this.emitter.emit('button.press', strippedButton)

                    if (e.data[2] === 127) {
                        this.emitter.emit('button.press', strippedButton);
                    }

                    if (e.data[2] === 0) {
                        this.emitter.emit('button.release', strippedButton);
                    }
                }
            })
        }
    }

    private stripButton(button: Button) {
        return {
            name: button.name,
            midi: button.midi,
        }
    }

    highlightButton(name: ButtonName, color: Color) {
        const button = buttons.find(b => b.name === name);
        if (!button) {
            console.error(`Button ${name} not found`);
            return;
        }

        const channel = this.channel;
        const statusByte = 0x90 + (channel - 1);
        const noteNumber = this.noteNameToMidi(button[color]);

        if (noteNumber) {
            this.output?.send([statusByte, noteNumber, 127]);
        } else {
            console.error(`Invalid MIDI note for ${name} (${color})`);
        }
    }

    /**
     * Turns off the LED of a button.
     */
    unhighlightButton(name: ButtonName) {
        const button = buttons.find(b => b.name === name);
        if (!button) {
            console.error(`Button ${name} not found`);
            return;
        }

        const channel = this.channel;
        const statusByte = 0x80 + (channel - 1); // Note-Off for Channel 2
        const noteNumber = button.midi;

        console.log(`Unhighlighting ${name} -> MIDI: [${statusByte}, ${noteNumber}, 0]`);
        this.output?.send([statusByte, noteNumber, 0]);
    }

    /**
     * Converts MIDI note names (e.g., "C2", "B0") into MIDI numbers (e.g., 35).
     */
    noteNameToMidi(note: string): number | null {
        const noteMap: Record<string, number> = {
            "C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5,
            "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11
        };

        const match = note.match(/^([A-G]#?)(-?\d)$/);
        if (!match) {
            console.error(`Invalid MIDI note: ${note}`);
            return null;
        }

        const [, notePart, octave] = match;
        return (parseInt(octave) + 1) * 12 + noteMap[notePart];
    }

    /**
     * Generates a mapping of MIDI note names to their corresponding note numbers.
     */
    private createMidiNoteMap(): Record<string, number> {
        const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const midiMap: Record<string, number> = {};

        // MIDI note numbers for octave 0 start at 0 (C0)
        for (let octave = 0; octave <= 9; octave++) {
            noteNames.forEach((note, index) => {
                const noteNumber = octave * 12 + index;
                midiMap[`${note}${octave}`] = noteNumber;
            });
        }
        return midiMap;
    }
}   