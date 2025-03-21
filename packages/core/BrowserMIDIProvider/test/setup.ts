import { createMockMIDIAccess, MockMIDIAccess } from "./mockWebMIDI";
const defaultMockMIDIAccess = createMockMIDIAccess();
const originalRequestMIDIAccess = globalThis.navigator.requestMIDIAccess;

(globalThis.navigator as any).requestMIDIAccess = () => Promise.resolve(defaultMockMIDIAccess);
export function createTestEnvironment() {
    const testMockMIDIAccess = createMockMIDIAccess();

    const useMockInTest = () => {
        (globalThis.navigator as any).requestMIDIAccess = () => Promise.resolve(testMockMIDIAccess);
        return testMockMIDIAccess;
    };

    const restoreDefaultMock = () => {
        (globalThis.navigator as any).requestMIDIAccess = () => Promise.resolve(defaultMockMIDIAccess);
    };

    return {
        useMockInTest,
        restoreDefaultMock,
        mockMIDIAccess: testMockMIDIAccess
    };
}
export const getMockMIDIAccess = () => defaultMockMIDIAccess;