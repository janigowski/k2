export interface MIDIProvider {
    connect(): Promise<void>
    disconnect(): Promise<void>
    getInput(options: MIDIIdentifierOptions): MIDIInput | undefined
    getOutput(options: MIDIIdentifierOptions): MIDIOutput | undefined
}

export type MIDIIdentifierOptions = {
    name: string
    channel: number
}

export type MIDIEventTypes = {
    // 🎹 Note Events
    "note.on": { note: number; velocity: number };
    "note.off": { note: number; velocity: number };

    // 🎛️ Control Change (CC) Events
    "control.change": { cc: number; value: number };

    // 🎵 Program Change Events
    "program.change": { program: number };

    // 🎤 Aftertouch (Pressure) Events
    "aftertouch.channel": { pressure: number }; // Applies to the whole channel
    "aftertouch.polyphonic": { note: number; pressure: number }; // Applies to a specific note

    // 🎚️ Pitch Bend Events
    "pitchbend": { value: number }; // -8192 to 8191 (14-bit range)

    // 🔥 System Exclusive (SysEx) Events
    "sysex": { data: Uint8Array };

    // ⏳ Timing & System Events
    "timing.clock": void; // MIDI Clock
    "timing.start": void; // Start playback
    "timing.stop": void; // Stop playback
    "timing.continue": void; // Continue playback

    // ⚠️ Error & Connection Events
    "midi.connect": { device: MIDIInput };
    "midi.disconnect": { device: MIDIInput };
    "midi.error": unknown;
};

// 🎛️ Extracting Event Names
export type MIDIEventName = keyof MIDIEventTypes;

export interface MIDIInput {
    name: string
    channel: number

    on<T extends MIDIEventName>(event: T, callback: (data: MIDIEventTypes[T]) => void): void
    off<T extends MIDIEventName>(event: T, callback: (data: MIDIEventTypes[T]) => void): void
}

export interface MIDIOutput {
    name: string

    setChannel(channel: number): void

    send(data: number[]): void
    sendNoteOn(note: string, velocity: number): void
    sendNoteOff(note: string): void
}