import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MockMIDIAccess, MockMIDIInput } from "./test/mockWebMIDI";
import { getMockMIDIAccess } from "./test/setup";
import { BrowserMIDIInput } from "./BrowserMIDIInput";

describe("BrowserMIDIInput", () => {
    beforeEach(() => {
        const midiAccess = getMockMIDIAccess();

        Array.from(midiAccess.inputs.keys()).forEach(id => midiAccess.removeInput(id));
        Array.from(midiAccess.outputs.keys()).forEach(id => midiAccess.removeOutput(id));

        midiAccess.addInput("input-1", "Mock MIDI Input 1");
        midiAccess.addOutput("output-1", "Mock MIDI Output 1");
    });

    it.only("should emit events only for attached channel", async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        const input = midiAccess.inputs.values().next().value as MockMIDIInput
        const browserInput = new BrowserMIDIInput(input.name, input)

        const onMessage = vi.fn();
        browserInput.on('midi.connect', onMessage)

        input.receiveMIDIMessage([144, 64, 127]);

        expect(onMessage).toHaveBeenCalledWith();
    });

    it("should emit Note On events", async () => {
        // "note.on": { note: number; velocity: number };

        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        const input = midiAccess.inputs.values().next().value;
        const output = midiAccess.outputs.values().next().value;



        const onMessage = vi.fn();
        input?.addEventListener("midimessage", onMessage);

        (input as any)?.receiveMIDIMessage([144, 64, 127]);
        output?.send([144, 64, 127]);

        expect(onMessage).toHaveBeenCalled();
    });

    it("should emit Note Off events", async () => {
        // "note.off": { note: number; velocity: number };
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        const input = midiAccess.inputs.values().next().value;
        const output = midiAccess.outputs.values().next().value;



        const onMessage = vi.fn();
        input?.addEventListener("midimessage", onMessage);

        (input as any)?.receiveMIDIMessage([144, 64, 127]);
        output?.send([144, 64, 127]);

        expect(onMessage).toHaveBeenCalled();
    });

    it("should emit Control Change events", async () => {
        // 🎛️ Control Change (CC) Events
        // "control.change": { cc: number; value: number };
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        const input = midiAccess.inputs.values().next().value;
        const output = midiAccess.outputs.values().next().value;



        const onMessage = vi.fn();
        input?.addEventListener("midimessage", onMessage);

        (input as any)?.receiveMIDIMessage([144, 64, 127]);
        output?.send([144, 64, 127]);

        expect(onMessage).toHaveBeenCalled();
    });



    it("should receive MIDI messages", async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        const input = midiAccess.inputs.values().next().value;
        const output = midiAccess.outputs.values().next().value;



        const onMessage = vi.fn();
        input?.addEventListener("midimessage", onMessage);

        (input as any)?.receiveMIDIMessage([144, 64, 127]);
        output?.send([144, 64, 127]);

        expect(onMessage).toHaveBeenCalled();
    });
});
