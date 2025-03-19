import { describe, expect, it } from "vitest";
import { BrowserMIDIProvider } from "./BrowserMIDIProvider";

describe('BrowserMIDIProvider', () => {
    it('should be defined', () => {
        expect(BrowserMIDIProvider).toBeDefined()
    })

    it('should connect to the MIDI device', () => {
        const provider = new BrowserMIDIProvider()
    })
})

