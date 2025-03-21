import { describe, expect, it } from "vitest";
import { BrowserMIDIProvider, BrowserMIDIOutput } from "./BrowserMIDIProvider";

describe('BrowserMIDIProvider', () => {
    it('should be defined', () => {
        expect(BrowserMIDIProvider).toBeDefined()
    })

    it('should connect to the MIDI device', () => {
        const provider = new BrowserMIDIProvider()
    })

    it('should route events to the correct input', () => {
        const provider = new BrowserMIDIProvider()
    })
})

