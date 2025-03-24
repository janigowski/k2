const NOTE_OFFSETS: Record<string, number> = {
    C: 0,
    'C#': 1, Db: 1,
    D: 2,
    'D#': 3, Eb: 3,
    E: 4,
    F: 5,
    'F#': 6, Gb: 6,
    G: 7,
    'G#': 8, Ab: 8,
    A: 9,
    'A#': 10, Bb: 10,
    B: 11,
};

export function noteToMIDINumber(note: string): number {
    const match = note.match(/^([A-Ga-g])(#|b)?(-?\d)$/);

    if (!match) throw new Error(`Invalid note format: "${note}"`);

    const [, base, accidental = '', octaveRaw] = match;
    const name = (base.toUpperCase() + accidental) as keyof typeof NOTE_OFFSETS;
    const offset = NOTE_OFFSETS[name];

    if (offset === undefined) throw new Error(`Unknown note: "${name}"`);

    const octave = parseInt(octaveRaw, 10);
    return (octave + 1) * 12 + offset;
}
