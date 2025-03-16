import { createMockMIDIAccess } from "./mockWebMIDI";

(globalThis.navigator as any).requestMIDIAccess = () => Promise.resolve(createMockMIDIAccess());