import { describe, expect, it, beforeEach, vi, afterEach } from "vitest"

import { K2 } from "./K2"
import type { MockMIDIAccess } from "./BrowserMIDIProvider/test/mockWebMIDI";
import { createTestEnvironment } from "./BrowserMIDIProvider/test/setup";
import { FakeMIDIInput, FakeMIDIOutput, FakeMIDIProvider } from "./FakeMIDIProvider";
describe("K2", () => {
    const testEnv = createTestEnvironment();

    beforeEach(() => {
        testEnv.useMockInTest();
    });

    afterEach(() => {
        testEnv.restoreDefaultMock();
    });

    it('should connect to the device on the given channel', async () => {
        const channel = 2
        const provider = new FakeMIDIProvider()
        provider.setInput({ name: "XONE:K2", channel }, new FakeMIDIInput("input-2"))

        const k2 = new K2(channel, provider)

        const handler = vi.fn()
        k2.on('connect', handler)

        await k2.connect()

        expect(handler).toHaveBeenCalled()
    })

    it('notify about button press', async () => {
        const channel = 2
        const provider = new FakeMIDIProvider()
        const input = new FakeMIDIInput("input-2")
        provider.setInput({ name: "XONE:K2", channel }, input)

        const k2 = new K2(channel, provider)
        await k2.connect()

        const handler = vi.fn()
        k2.on('button.press', handler)

        input.emit('note.on', { note: 15, velocity: 127 })

        expect(handler).toHaveBeenCalledWith(
            {
                name: 'exit-setup',
                midi: 15,
            }
        )
    })

    it('notify about button release', async () => {
        const channel = 2
        const provider = new FakeMIDIProvider()
        const input = new FakeMIDIInput("input-2")
        provider.setInput({ name: "XONE:K2", channel }, input)

        const k2 = new K2(channel, provider)
        await k2.connect()

        const handler = vi.fn()
        k2.on('button.release', handler)

        input.emit('note.on', { note: 15, velocity: 0 })

        expect(handler).toHaveBeenCalledWith(
            {
                name: 'exit-setup',
                midi: 15,
            }
        )
    })

    it('notify about fader change', async () => {
        const channel = 2
        const provider = new FakeMIDIProvider()
        const input = new FakeMIDIInput("input-2")
        provider.setInput({ name: "XONE:K2", channel }, input)

        const k2 = new K2(channel, provider)
        await k2.connect()

        const handler = vi.fn()
        k2.on('fader.change', handler)

        input.emit('control.change', { cc: 16, value: 64 })

        expect(handler).toHaveBeenCalledWith(
            {
                name: 'fader-1',
                value: 64 / 127,
            }
        )
    })

    it.skip('should return all buttons', () => {
        // const k2 = new K2(2)
        // const buttons = k2.getButtons()
        // expect(buttons).toBeDefined()
    })

    it('should notify about knob change', async () => {
        const channel = 2
        const provider = new FakeMIDIProvider()
        const input = new FakeMIDIInput("input-2")
        provider.setInput({ name: "XONE:K2", channel }, input)

        const k2 = new K2(channel, provider)
        await k2.connect()

        const handler = vi.fn()
        k2.on('knob.change', handler)

        input.emit('control.change', { cc: 10, value: 20 })

        expect(handler).toHaveBeenCalledWith(
            {
                name: 'knob-7',
                value: 20 / 127,
            }
        )
    })

    it('should notify about encoder rotation', async () => {
        const channel = 2
        const provider = new FakeMIDIProvider()
        const input = new FakeMIDIInput("input-2")
        provider.setInput({ name: "XONE:K2", channel }, input)

        const k2 = new K2(channel, provider)
        await k2.connect()

        const handler = vi.fn()
        k2.on('encoder.turn', handler)

        input.emit('control.change', { cc: 0, value: 127 })

        expect(handler).toHaveBeenCalledWith(
            {
                name: 'encoder-1',
                value: 1,
            }
        )
    })

    it('should highlight the given button', async () => {
        const channel = 2
        const provider = new FakeMIDIProvider()
        const output = new FakeMIDIOutput("output-2")
        provider.setOutput({ name: "XONE:K2", channel }, output)

        const k2 = new K2(channel, provider)
        await k2.connect()

        vi.spyOn(output, 'sendNoteOn')

        k2.highlightButton('exit-setup', 'green')

        expect(output.sendNoteOn).toHaveBeenCalledWith('B0', 127)
    })

    it('should unhighlight the given button', async () => {
        const channel = 2
        const provider = new FakeMIDIProvider()
        const output = new FakeMIDIOutput("output-2")
        provider.setOutput({ name: "XONE:K2", channel }, output)

        const k2 = new K2(channel, provider)
        await k2.connect()

        vi.spyOn(output, 'sendNoteOff')

        k2.unhighlightButton('exit-setup')

        expect(output.sendNoteOff).toHaveBeenCalledWith('B0')
    })

    it.skip('should unhighlight all buttons', () => {
        // const k2 = new K2(2)
        // k2.unhighlightAllButtons()
        // expect(k2.isButtonHighlighted(1)).toBe(false)
    })
})
