import { describe, it, expect, vi } from "vitest";
import { BrowserMIDIOutput } from "./BrowserMIDIOutput";
import { FakeMIDIOutput } from "../FakeMIDIProvider";

describe("BrowserMIDIOutput", () => {
    it("should respect the MIDI channel when sending messages", () => {
        const output = new FakeMIDIOutput('output-1');
        const channel = 2;
        const browserOutput = new BrowserMIDIOutput('output-1', channel, output as WebMidi.MIDIOutput);

        const sendSpy = vi.spyOn(output, 'send');

        browserOutput.sendNoteOff(10, 10);

        // Note Off command (0x80) for channel 2 (0x81)
        expect(sendSpy).toHaveBeenCalledWith([0x81, 10, 10]);
    });

    it("should send Note Off messages with numeric note", () => {
        const output = new FakeMIDIOutput('output-1');
        const channel = 4;
        const browserOutput = new BrowserMIDIOutput('output-1', channel, output as WebMidi.MIDIOutput);

        const sendSpy = vi.spyOn(output, 'send');

        browserOutput.sendNoteOff(64, 127);

        expect(sendSpy).toHaveBeenCalledWith([0x83, 64, 127]);
    });

    it("should send Note Off messages with string note", () => {
        const output = new FakeMIDIOutput('output-1');
        const channel = 4;
        const browserOutput = new BrowserMIDIOutput('output-1', channel, output as WebMidi.MIDIOutput);

        const sendSpy = vi.spyOn(output, 'send');

        browserOutput.sendNoteOff('C4', 127);

        // C4 should be converted to the appropriate MIDI number (60)
        expect(sendSpy).toHaveBeenCalledWith([0x83, 60, 127]);
    });

    it("should send Note On messages with string note", () => {
        const output = new FakeMIDIOutput('output-1');
        const channel = 4;
        const browserOutput = new BrowserMIDIOutput('output-1', channel, output as WebMidi.MIDIOutput);

        const sendSpy = vi.spyOn(output, 'send');

        browserOutput.sendNoteOn('C4', 127);

        // Note On command (0x90) for channel 4 (0x93)
        expect(sendSpy).toHaveBeenCalledWith([0x93, 60, 127]);
    });

    it("should send Note On messages with numeric note", () => {
        const output = new FakeMIDIOutput('output-1');
        const channel = 4;
        const browserOutput = new BrowserMIDIOutput('output-1', channel, output as WebMidi.MIDIOutput);

        const sendSpy = vi.spyOn(output, 'send');

        browserOutput.sendNoteOn(64, 127);

        // Note On command (0x90) for channel 4 (0x93)
        expect(sendSpy).toHaveBeenCalledWith([0x93, 64, 127]);
    });
});
