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

    it("should send events only for attached channel", async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        const input = midiAccess.inputs.values().next().value
        const channel = 5
        const browserInput = new BrowserMIDIInput('input-1', channel, input as WebMidi.MIDIInput);

        const onMessage = vi.fn();
        browserInput.on('note.on', onMessage);

        /* MIDI Message for Channel 5
        Status Byte = 0x94 = (0x90 + 0x04) = (Note On + Channel 4)
        */
        (input as MockMIDIInput).receiveMIDIMessage([0x94, 0, 0]);
        (input as MockMIDIInput).receiveMIDIMessage([0x95, 0, 0]);
        (input as MockMIDIInput).receiveMIDIMessage([0x96, 0, 0]);
        (input as MockMIDIInput).receiveMIDIMessage([0x9f, 0, 0]);

        expect(onMessage).toHaveBeenCalledTimes(1)
    });

    it("should send Note On message", async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        const input = midiAccess.inputs.values().next().value
        const channel = 4
        const browserInput = new BrowserMIDIInput('input-1', channel, input as WebMidi.MIDIInput);

        const onMessage = vi.fn();
        browserInput.on('note.on', onMessage);

        (input as MockMIDIInput).receiveMIDIMessage([0x93, 64, 127]);

        expect(onMessage).toHaveBeenCalledWith({ note: 64, velocity: 127 });
    });

    it("sends Note Off message", async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        const input = midiAccess.inputs.values().next().value
        const channel = 4
        const browserInput = new BrowserMIDIInput('input-1', channel, input as WebMidi.MIDIInput);

        const onMessage = vi.fn();
        browserInput.on('note.off', onMessage);

        (input as MockMIDIInput).receiveMIDIMessage([0x83, 0, 0]);

        expect(onMessage).toHaveBeenCalledWith({ note: 0, velocity: 0 });
    });
});
