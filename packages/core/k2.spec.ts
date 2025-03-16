import { describe, expect, it, beforeEach, vi, beforeAll } from "vitest"
import * as WMT from 'web-midi-test';

import { K2 } from "./K2"

class MIDIMessageEvent extends Event {
    constructor(type: string, eventInitDict: { data: Uint8Array }) {
        super(type);
        this.data = eventInitDict.data;
    }
    data: Uint8Array;
}

let midiAccess: MIDIAccess;
let controller: K2;
let input: MIDIInput;
let output: MIDIOutput;

describe("K2", () => {
    it('should connect to the device on the given channel', async () => {
        const midiAccess = await navigator.requestMIDIAccess();

        // Add extra devices
        midiAccess.addInput("input-2", "XONE:K2");
        midiAccess.addOutput("output-2", "XONE:K2");

        const channel = 2
        const k2 = new K2(channel)

        const handler = vi.fn()
        k2.on('connect', handler)

        await k2.connect()

        expect(handler).toHaveBeenCalled()
    })

    it.skip('notify about button press', async () => {
        const k2 = new K2(2)

        const handler = vi.fn()
        k2.on('exit-setup.press', handler)

        await k2.connect()
        k2.attachEvents()


        // const input = Array.from(inputs.values())[0]
        // input.dispatchEvent(new MIDIMessageEvent('midimessage', {
        //     data: new Uint8Array([144, 23, 127])
        // }))

        expect(handler).toHaveBeenCalled()
    })

    it.skip('notify about button release', () => {
        // const k2 = new K2(2)
        // k2.on('buttonRelease', (button) => {
        //     expect(button).toBe(1)
        // })
    })

    it.skip('should return all buttons', () => {
        // const k2 = new K2(2)
        // const buttons = k2.getButtons()
        // expect(buttons).toBeDefined()
    })

    it.skip('should notify about fader change', () => {
        // const k2 = new K2(2)
        // k2.on('faderChange', (fader) => {
        //     expect(fader).toBe(1)
        // })
    })

    it.skip('should notify about knob change', () => {
        // const k2 = new K2(2)
        // k2.on('knobChange', (knob) => {
        //     expect(knob).toBe(1)
        // })
    })

    it.skip('should highlight the given button', () => {
        // const k2 = new K2(2)
        // k2.highlightButton(1)
        // expect(k2.isButtonHighlighted(1)).toBe(true)
    })

    it.skip('should unhighlight the given button', () => {
        // const k2 = new K2(2)
        // k2.unhighlightButton(1)
        // expect(k2.isButtonHighlighted(1)).toBe(false)
    })

    it.skip('should unhighlight all buttons', () => {
        // const k2 = new K2(2)
        // k2.unhighlightAllButtons()
        // expect(k2.isButtonHighlighted(1)).toBe(false)
    })
})
