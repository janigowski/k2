import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MockMIDIAccess } from "./test/mockWebMIDI";
import { getMockMIDIAccess } from "./test/setup";

describe("BrowserMIDI", () => {
    beforeEach(() => {
        const midiAccess = getMockMIDIAccess();

        Array.from(midiAccess.inputs.keys()).forEach(id => midiAccess.removeInput(id));
        Array.from(midiAccess.outputs.keys()).forEach(id => midiAccess.removeOutput(id));

        midiAccess.addInput("input-1", "Mock MIDI Input 1");
        midiAccess.addOutput("output-1", "Mock MIDI Output 1");
    });

    it("should detect multiple MIDI inputs and outputs", async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        midiAccess.addInput("input-2", "Mock MIDI Input 2");
        midiAccess.addOutput("output-2", "Mock MIDI Output 2");

        expect(midiAccess.inputs.size).toBe(2);
        expect(midiAccess.outputs.size).toBe(2);
    });

    it("should remove MIDI devices dynamically", async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        midiAccess.addInput("input-3", "Mock MIDI Input 3");
        midiAccess.removeInput("input-3");

        expect(midiAccess.inputs.size).toBe(1);
    });

    it("should trigger statechange when a device is added", async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        const onStateChange = vi.fn();
        midiAccess.addEventListener("statechange", onStateChange);

        midiAccess.addInput("input-4", "Mock MIDI Input 4");

        expect(onStateChange).toHaveBeenCalled();
    });

    it('should provide access to MIDI devices', async () => {
        expect(navigator.requestMIDIAccess).toBeDefined();

        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        expect(midiAccess.inputs.size).toBeGreaterThan(0);
        expect(midiAccess.outputs.size).toBeGreaterThan(0);
    });

    it('should trigger statechange events when devices are added or removed', async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;

        const onStateChange = vi.fn();
        midiAccess.addEventListener('statechange', onStateChange);

        midiAccess.addInput('input-2', 'Mock MIDI Input 2');
        expect(onStateChange).toHaveBeenCalledTimes(1);

        midiAccess.removeInput('input-2');
        expect(onStateChange).toHaveBeenCalledTimes(2);
    });
});
