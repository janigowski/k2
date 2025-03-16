import { describe, it, expect, vi } from "vitest";
import type { MockMIDIAccess } from "./test/mockWebMIDI";

describe("WebMIDI Library with Multiple Devices", () => {
    it("should detect multiple MIDI inputs and outputs", async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess

        midiAccess.addInput("input-2", "Mock MIDI Input 2");
        midiAccess.addOutput("output-2", "Mock MIDI Output 2");

        expect(midiAccess.inputs.size).toBe(2);
        expect(midiAccess.outputs.size).toBe(2);
    });

    it("should remove MIDI devices dynamically", async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess

        midiAccess.addInput("input-3", "Mock MIDI Input 3");
        midiAccess.removeInput("input-3");

        expect(midiAccess.inputs.size).toBe(1);
    });

    it("should trigger statechange when a device is added", async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess

        const onStateChange = vi.fn();
        midiAccess.addEventListener("statechange", onStateChange);

        midiAccess.addInput("input-4", "Mock MIDI Input 4");

        expect(onStateChange).toHaveBeenCalled();
    });

    it("should correctly receive MIDI messages", async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess

        const input = midiAccess.inputs.values().next().value;
        const output = midiAccess.outputs.values().next().value;

        console.log({ input, output })

        const onMessage = vi.fn();
        input?.addEventListener("midimessage", onMessage);

        input?.receiveMIDIMessage([144, 64, 127]);
        output?.send([144, 64, 127]);

        expect(onMessage).toHaveBeenCalled();
    });

    it('should provide access to MIDI devices', async () => {
        expect(navigator.requestMIDIAccess).toBeDefined();

        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess

        expect(midiAccess.inputs.size).toBeGreaterThan(0);
        expect(midiAccess.outputs.size).toBeGreaterThan(0);
    });

    it('should allow sending MIDI messages', async () => {
        const midiAccess = await navigator.requestMIDIAccess();
        const output = midiAccess.outputs.get('output-1');

        const consoleSpy = vi.spyOn(console, 'log');

        output?.send([0x90, 60, 127]);

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Sent 144,60,127'));

        consoleSpy.mockRestore();
    });

    it('should allow receiving MIDI messages', async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess;
        const input = midiAccess.inputs.get('input-1');

        const onMidiMessage = vi.fn();
        input?.addEventListener('midimessage', onMidiMessage);

        input?.receiveMIDIMessage([0x90, 60, 127]);

        expect(onMidiMessage).toHaveBeenCalledTimes(1);
        expect(onMidiMessage.mock.calls[0][0].data).toEqual(new Uint8Array([0x90, 60, 127]));
    });

    it('should trigger statechange events when devices are added or removed', async () => {
        const midiAccess = await navigator.requestMIDIAccess() as unknown as MockMIDIAccess

        const onStateChange = vi.fn();
        midiAccess.addEventListener('statechange', onStateChange);

        midiAccess.addInput('input-2', 'Mock MIDI Input 2');
        expect(onStateChange).toHaveBeenCalledTimes(1);

        midiAccess.removeInput('input-2');
        expect(onStateChange).toHaveBeenCalledTimes(2);
    });
});
