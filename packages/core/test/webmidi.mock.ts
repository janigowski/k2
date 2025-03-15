import { vi } from 'vitest'

export const mockWebMidi = {
    enable: vi.fn().mockResolvedValue(undefined),
    inputs: [],
    outputs: [],
    getInputByName: vi.fn(),
    getOutputByName: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn()
}

vi.mock('webmidi', () => ({
    WebMidi: mockWebMidi
})) 