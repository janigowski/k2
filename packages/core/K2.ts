import type { Channel } from "./types";
import mitt, { type Emitter, type Handler } from "mitt";
import { buttons, type Button, type StrippedButton, type Color, type ButtonName, faders, controls } from "./controlls";
import type { MIDIInput, MIDIOutput, MIDIProvider } from "./interfaces/MIDIProvider";

export type KnobEvent = { name: string, value: number }
export type FaderEvent = { name: string, value: number }
export type EncoderEvent = { name: string, value: -1 | 1 }

type ButtonEvents = {
    'button.press': StrippedButton;
    'button.release': StrippedButton;
    'fader.change': FaderEvent;
    'knob.change': KnobEvent;
    'encoder.turn': EncoderEvent;
};

type Events = {
    connect: void
    connectionError: unknown
} & ButtonEvents;

type EventNames = keyof Events

export enum K2State {
    Disconnected = 'disconnected',
    Connecting = 'connecting',
    Connected = 'connected',
    Error = 'error'
}

export class K2 {
    private emitter: Emitter<Events>
    private input?: MIDIInput
    private output?: MIDIOutput
    private state: K2State = K2State.Disconnected

    constructor(private channel: Channel, public provider: MIDIProvider) {
        this.emitter = mitt()
    }

    getState(): K2State {
        return this.state
    }

    async connect(): Promise<void> {
        if (this.state === K2State.Connecting || this.state === K2State.Connected) {
            return
        }

        this.state = K2State.Connecting

        try {
            const input = this.provider.getInput({ name: 'XONE:K2', channel: this.channel })
            const output = this.provider.getOutput({ name: 'XONE:K2', channel: this.channel })

            console.log({ input, output })

            if (input) {
                this.input = input
                this.attachInputEvents()
                this.state = K2State.Connected
                this.emitter.emit('connect')
            }

            if (output) {
                this.output = output
            }
        } catch (error) {
            console.log('Error connecting to K2', error)
            this.state = K2State.Error
            this.emitter.emit('connectionError', error)
        }
    }

    on<T extends EventNames>(event: T, callback: Handler<Events[T]>): void {
        this.emitter.on(event, callback)
    }

    private attachInputEvents() {
        if (this.input) {

            this.input.on('note.on', ({ note, velocity }) => {
                const button = buttons.find(b => b.midi === note);

                if (button) {
                    const strippedButton = this.stripButton(button)

                    this.emitter.emit('button.press', strippedButton);
                }
            })

            this.input.on('note.off', ({ note, velocity }) => {
                const button = buttons.find(b => b.midi === note);

                if (button) {
                    this.emitter.emit('button.release', this.stripButton(button));
                }
            })

            this.input.on('control.change', ({ cc, value }) => {
                const control = controls.find(c => c.cc === cc);
                const maxValue = 127


                if (control?.name.includes('fader')) {
                    this.emitter.emit('fader.change', { name: control.name, value: value / maxValue });
                }

                if (control?.name.includes('knob')) {
                    this.emitter.emit('knob.change', { name: control.name, value: value / maxValue });
                }

                if (control?.name.includes('encoder')) {
                    this.emitter.emit('encoder.turn', { name: control.name, value: value === maxValue ? 1 : -1 });
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

        const maxVelocity = 127
        this.output?.sendNoteOn(button[color], maxVelocity);
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

        this.output?.sendNoteOff(button['green']);
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