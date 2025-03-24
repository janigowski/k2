import { describe, expect, it } from "vitest";
import { buttons, encoders, faders, getButtonByMidi, knobs, leds } from "./controlls";

describe("Controls", () => {
    it("should have 36 buttons", () => {
        expect(buttons.length).toBe(36);
    })

    it("should have 4 faders", () => {
        expect(faders.length).toBe(4);
    })

    it("should have 12 knobs", () => {
        expect(knobs.length).toBe(12);
    })

    it("should have 6 encoders", () => {
        expect(encoders.length).toBe(6);
    })

    it.skip("should have 34 LEDs", () => {
        expect(leds.length).toBe(34);
    })

    it("should map button names to midi numbers", () => {
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
});

