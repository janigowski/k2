import { describe, expect, it, beforeEach, vi, afterEach } from "vitest"

import { K2 } from "./K2"
import type { MockMIDIAccess } from "./test/mockWebMIDI";
import { createTestEnvironment } from "./test/setup";

describe("K2", () => {
    const testEnv = createTestEnvironment();

    beforeEach(() => {
        testEnv.useMockInTest();
    });

    afterEach(() => {
        testEnv.restoreDefaultMock();
    });

    it('should connect to the device on the given channel', async () => {
        const midiAccess = testEnv.mockMIDIAccess;

        midiAccess.addInput("input-2", "XONE:K2");
        midiAccess.addOutput("output-2", "XONE:K2");

        const channel = 2
        const k2 = new K2(channel)

        const handler = vi.fn()
        k2.on('connect', handler)

        await k2.connect()

        expect(handler).toHaveBeenCalled()
    })

    it('notify about button press', async () => {
        const midiAccess = testEnv.mockMIDIAccess;

        midiAccess.addInput("input-2", "XONE:K2");
        midiAccess.addOutput("output-2", "XONE:K2");

        const k2 = new K2(2)
        await k2.connect()

        const handler = vi.fn()
        k2.on('button.press', handler)

        const input = midiAccess.inputs.get('input-2')
        input?.receiveMIDIMessage([144, 15, 127])

        expect(handler).toHaveBeenCalledWith(
            {
                name: 'exit-setup',
                midi: 15,
            }
        )
    })

    it('notify about button release', async () => {
        const midiAccess = testEnv.mockMIDIAccess;

        midiAccess.addInput("input-2", "XONE:K2");
        midiAccess.addOutput("output-2", "XONE:K2");

        const k2 = new K2(2)
        await k2.connect()

        const handler = vi.fn()
        k2.on('button.release', handler)

        const input = midiAccess.inputs.get('input-2')
        input?.receiveMIDIMessage([144, 15, 0])

        expect(handler).toHaveBeenCalledWith(
            {
                name: 'exit-setup',
                midi: 15,
            }
        )
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

    it('should highlight the given button', async () => {
        const midiAccess = testEnv.mockMIDIAccess;

        midiAccess.addInput("input-2", "XONE:K2");
        midiAccess.addOutput("output-2", "XONE:K2");

        const k2 = new K2(2)
        await k2.connect()

        const output = midiAccess.outputs.get('output-2')
        vi.spyOn(output, 'send')

        k2.highlightButton('exit-setup', 'green')

        expect(output?.send).toHaveBeenCalledWith([145, 23, 127])
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
