import { describe, expect, it } from "vitest";
import { buttons, encoders, faders, getButtonByMidi, getEncoderByControlChange, getFaderByControlChange, getKnobByControlChange, getLedByName, knobs, leds, type LedName } from "./controlls";

describe("Controls", () => {
    it("have 36 Buttons", () => {
        expect(buttons.length).toBe(36);
    })

    it("have 4 Faders", () => {
        expect(faders.length).toBe(4);
    })

    it("have 12 Knobs", () => {
        expect(knobs.length).toBe(12);
    })

    it("have 6 Encoders", () => {
        expect(encoders.length).toBe(6);
    })

    it("have 34 LEDs", () => {
        expect(leds.length).toBe(34);
    })

    it("map Buttons name to MIDI number", () => {
        const buttonsMap = [
            { name: "encoder-1", note: 'E3', midi: 52 },
            { name: "encoder-2", note: 'F3', midi: 53 },
            { name: "encoder-3", note: 'F#3', midi: 54 },
            { name: "encoder-4", note: 'G3', midi: 55 },
            { name: "button-1", note: 'C3', midi: 48 },
            { name: "button-2", note: 'C#3', midi: 49 },
            { name: "button-3", note: 'D3', midi: 50 },
            { name: "button-4", note: 'D#3', midi: 51 },
            { name: "button-5", note: 'G#2', midi: 44 },
            { name: "button-6", note: 'A2', midi: 45 },
            { name: "button-7", note: 'A#2', midi: 46 },
            { name: "button-8", note: 'B2', midi: 47 },
            { name: "button-9", note: 'E2', midi: 40 },
            { name: "button-10", note: 'F2', midi: 41 },
            { name: "button-11", note: 'F#2', midi: 42 },
            { name: "button-12", note: 'G2', midi: 43 },
            { name: "A", note: 'C2', midi: 36 },
            { name: "B", note: 'C#2', midi: 37 },
            { name: "C", note: 'D2', midi: 38 },
            { name: "D", note: 'D#2', midi: 39 },
            { name: "E", note: 'G#1', midi: 32 },
            { name: "F", note: 'A1', midi: 33 },
            { name: "G", note: 'A#1', midi: 34 },
            { name: "H", note: 'B1', midi: 35 },
            { name: "I", note: 'E1', midi: 28 },
            { name: "J", note: 'F1', midi: 29 },
            { name: "K", note: 'F#1', midi: 30 },
            { name: "L", note: 'G1', midi: 31 },
            { name: "M", note: 'C1', midi: 24 },
            { name: "N", note: 'C#1', midi: 25 },
            { name: "O", note: 'D1', midi: 26 },
            { name: "P", note: 'D#1', midi: 27 },
            { name: "layer", note: 'C0', midi: 12 },
            { name: "encoder-5", note: 'C#0', midi: 13 },
            { name: "encoder-6", note: 'D0', midi: 14 },
            { name: "exit-setup", note: 'D#0', midi: 15 }
        ];


        buttonsMap.forEach((item) => {
            const button = getButtonByMidi(item.midi);

            expect(button?.midi).toBe(item.midi);
        });
    });

    it("map LED names to color", () => {
        const ledsMap: { name: LedName, red: string, amber: string, green: string }[] = [
            {
                name: "encoder-1",
                red: "E3",
                amber: "E6",
                green: "E9",
            },
            {
                name: "encoder-2",
                red: "F3",
                amber: "F6",
                green: "F9",
            },
            {
                name: "encoder-3",
                red: "F#3",
                amber: "F#6",
                green: "F#9",
            },
            {
                name: "encoder-4",
                red: "G3",
                amber: "G6",
                green: "G9",
            },
            {
                name: "button-1",
                red: "C3",
                amber: "C6",
                green: "C9",
            },
            {
                name: "button-2",
                red: "C#3",
                amber: "C#6",
                green: "C#9",
            },
            {
                name: "button-3",
                red: "D3",
                amber: "D6",
                green: "D9",
            },
            {
                name: "button-4",
                red: "D#3",
                amber: "D#6",
                green: "D#9",
            },
            {
                name: "button-5",
                red: "G#2",
                amber: "G#5",
                green: "G#8",
            },
            {
                name: "button-6",
                red: "A2",
                amber: "A5",
                green: "A8",
            },
            {
                name: "button-7",
                red: "A#2",
                amber: "A#5",
                green: "A#8",
            },
            {
                name: "button-8",
                red: "B2",
                amber: "B5",
                green: "B8",
            },
            {
                name: "button-9",
                red: "E2",
                amber: "E5",
                green: "E8",
            },
            {
                name: "button-10",
                red: "F2",
                amber: "F5",
                green: "F8",
            },
            {
                name: "button-11",
                red: "F#2",
                amber: "F#5",
                green: "F#8",
            },
            {
                name: "button-12",
                red: "G2",
                amber: "G5",
                green: "G8",
            },
            {
                name: "A",
                red: "C2",
                amber: "C5",
                green: "C8",
            },
            {
                name: "B",
                red: "C#2",
                amber: "C#5",
                green: "C#8",
            },
            {
                name: "C",
                red: "D2",
                amber: "D5",
                green: "D8",
            },
            {
                name: "D",
                red: "D#2",
                amber: "D#5",
                green: "D#8",
            },
            {
                name: "E",
                red: "G#1",
                amber: "G#4",
                green: "G#7",
            },
            {
                name: "F",
                red: "A1",
                amber: "A4",
                green: "A7",
            },
            {
                name: "G",
                red: "A#1",
                amber: "A#4",
                green: "A#7",
            },
            {
                name: "H",
                red: "B1",
                amber: "B4",
                green: "B7",
            },
            {
                name: "I",
                red: "E1",
                amber: "E4",
                green: "E7",
            },
            {
                name: "J",
                red: "F1",
                amber: "F4",
                green: "F7",
            },
            {
                name: "K",
                red: "F#1",
                amber: "F#4",
                green: "F#7",
            },
            {
                name: "L",
                red: "G1",
                amber: "G4",
                green: "G7",
            },
            {
                name: "M",
                red: "C1",
                amber: "C4",
                green: "C7",
            },
            {
                name: "N",
                red: "C#1",
                amber: "C#4",
                green: "C#7",
            },
            {
                name: "O",
                red: "D1",
                amber: "D4",
                green: "D7",
            },
            {
                name: "P",
                red: "D#1",
                amber: "D#4",
                green: "D#7",
            },
            {
                name: "layer",
                red: "C0",
                amber: "E0",
                green: "G#0",
            },
            {
                name: "exit-setup",
                red: "D#0",
                amber: "G0",
                green: "B0",
            },
        ]


        ledsMap.forEach((item) => {
            const led = getLedByName(item.name);

            expect(led?.red).toBe(item.red);
            expect(led?.amber).toBe(item.amber);
            expect(led?.green).toBe(item.green);
        });
    });

    it("map Encoders Control Change number to names", () => {
        const encodersMap = [
            { name: "encoder-1", cc: 0 },
            { name: "encoder-2", cc: 1 },
            { name: "encoder-3", cc: 2 },
            { name: "encoder-4", cc: 3 },
            { name: "encoder-5", cc: 20 },
            { name: "encoder-6", cc: 21 },
        ];


        encodersMap.forEach((item) => {
            const encoder = getEncoderByControlChange(item.cc);

            expect(encoder?.name).toBe(item.name);
        });
    });

    it("map Faders Control Change number to names", () => {
        const fadersMap = [
            { name: "fader-1", cc: 16 },
            { name: "fader-2", cc: 17 },
            { name: "fader-3", cc: 18 },
            { name: "fader-4", cc: 19 },
        ];


        fadersMap.forEach((item) => {
            const fader = getFaderByControlChange(item.cc);

            expect(fader?.name).toBe(item.name);
        });
    });

    it("map Knobs Control Change number to names", () => {
        const knobsMap = [
            { name: "knob-1", cc: 4 },
            { name: "knob-2", cc: 5 },
            { name: "knob-3", cc: 6 },
            { name: "knob-4", cc: 7 },
            { name: "knob-5", cc: 8 },
            { name: "knob-6", cc: 9 },
            { name: "knob-7", cc: 10 },
            { name: "knob-8", cc: 11 },
            { name: "knob-9", cc: 12 },
            { name: "knob-10", cc: 13 },
            { name: "knob-11", cc: 14 },
            { name: "knob-12", cc: 15 },
        ];


        knobsMap.forEach((item) => {
            const knob = getKnobByControlChange(item.cc);

            expect(knob?.name).toBe(item.name);
        });
    });
});

