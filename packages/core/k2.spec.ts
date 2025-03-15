import { describe, expect, it, beforeEach, vi } from "vitest"
import * as WMT from 'web-midi-test';

import { K2 } from "./K2"

// navigator.requestMIDIAccess = WMT.requestMIDIAccess;


describe("K2", () => {
    beforeEach(() => {

    })

    it.only('should connect to the device on the given channel', async () => {
        const channel = 2
        const k2 = new K2(channel)

        const handler = vi.fn()
        k2.on('connect', handler)

        await k2.connect()

        expect(handler).toHaveBeenCalled()
    })

    it.skip('should throw an error if the WebMIDI connection is insecure', async () => {
        const k2 = new K2(2)

        // prepare WMT to throw an error
        // WMT.requestMIDIAccess.mockRejectedValue(new Error('Insecure connection'))

        const handler = vi.fn()
        k2.on('connectionError', handler)

        await k2.connect()

        expect(handler).toHaveBeenCalled()
    })

    it('should notify about insecure connection', () => {
        const k2 = new K2(2)
        // k2.on('insecureConnection', () => {
        //     expect(true).toBe(true)
        // })
    })

    it('notify about button press', () => {
        // const k2 = new K2(2)
        // k2.on('buttonPress', (button) => {
        //     expect(button).toBe(1)
        // })
    })

    it('notify about button release', () => {
        // const k2 = new K2(2)
        // k2.on('buttonRelease', (button) => {
        //     expect(button).toBe(1)
        // })
    })

    it('should return all buttons', () => {
        // const k2 = new K2(2)
        // const buttons = k2.getButtons()
        // expect(buttons).toBeDefined()
    })

    it('should notify about fader change', () => {
        // const k2 = new K2(2)
        // k2.on('faderChange', (fader) => {
        //     expect(fader).toBe(1)
        // })
    })

    it('should notify about knob change', () => {
        // const k2 = new K2(2)
        // k2.on('knobChange', (knob) => {
        //     expect(knob).toBe(1)
        // })
    })

    it('should highlight the given button', () => {
        // const k2 = new K2(2)
        // k2.highlightButton(1)
        // expect(k2.isButtonHighlighted(1)).toBe(true)
    })

    it('should unhighlight the given button', () => {
        // const k2 = new K2(2)
        // k2.unhighlightButton(1)
        // expect(k2.isButtonHighlighted(1)).toBe(false)
    })

    it('should unhighlight all buttons', () => {
        // const k2 = new K2(2)
        // k2.unhighlightAllButtons()
        // expect(k2.isButtonHighlighted(1)).toBe(false)
    })
})
