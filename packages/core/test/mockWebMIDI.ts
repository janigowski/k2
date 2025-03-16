// test/mockWebMIDI.ts
class MIDIConnectionEvent extends Event {
    port: MockMIDIInput | MockMIDIOutput;
    constructor(type: string, port: MockMIDIInput | MockMIDIOutput) {
        super(type);
        this.port = port;
    }
}

// test/mockWebMIDI.ts
class MockMIDIInput extends EventTarget {
    id: string;
    name: string;
    manufacturer: string;
    type: "input" = "input";
    state: "connected" | "disconnected" = "connected";
    onmidimessage: ((event: MIDIMessageEvent) => void) | null = null;

    constructor(id: string, name: string) {
        super();
        this.id = id;
        this.name = name;
        this.manufacturer = "Mock Manufacturer";
    }

    async open(): Promise<void> {
        this.state = "connected";
    }

    async close(): Promise<void> {
        this.state = "disconnected";
    }

    receiveMIDIMessage(data: number[]) {
        const event = new MIDIMessageEvent("midimessage", { data: new Uint8Array(data) });
        if (this.onmidimessage) this.onmidimessage(event);
        this.dispatchEvent(event);
    }

    addListener(eventType: string, callback: (event: Event) => void) {
        this.addEventListener(eventType, callback);
    }
}

class MockMIDIOutput {
    id: string;
    name: string;
    manufacturer: string;
    type: "output" = "output";
    state: "connected" | "disconnected" = "connected";

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.manufacturer = "Mock Manufacturer";
    }

    async open(): Promise<void> {
        this.state = "connected";
    }

    async close(): Promise<void> {
        this.state = "disconnected";
    }

    send(data: number[], timestamp?: number) {
        console.log(`MIDI Output (${this.name}): Sent ${data} at ${timestamp ?? performance.now()}`);
    }
}


class MockMIDIAccess extends EventTarget {
    inputs: Map<string, MockMIDIInput>;
    outputs: Map<string, MockMIDIOutput>;
    onstatechange: ((event: MIDIConnectionEvent) => void) | null = null;

    constructor() {
        super();
        this.inputs = new Map();
        this.outputs = new Map();

        // Default devices
        this.addInput("input-1", "Mock MIDI Input 1");
        this.addOutput("output-1", "Mock MIDI Output 1");
    }

    addInput(id: string, name: string) {
        const input = new MockMIDIInput(id, name);
        this.inputs.set(id, input);
        const event = new MIDIConnectionEvent("statechange", input);
        this.dispatchEvent(event);
        if (this.onstatechange) this.onstatechange(event);
    }

    addOutput(id: string, name: string) {
        const output = new MockMIDIOutput(id, name);
        this.outputs.set(id, output);
        const event = new MIDIConnectionEvent("statechange", output);
        this.dispatchEvent(event);
        if (this.onstatechange) this.onstatechange(event);
    }

    removeInput(id: string) {
        if (this.inputs.has(id)) {
            const input = this.inputs.get(id)!;
            this.inputs.delete(id);
            const event = new MIDIConnectionEvent("statechange", input);
            this.dispatchEvent(event);
            if (this.onstatechange) this.onstatechange(event);
        }
    }

    removeOutput(id: string) {
        if (this.outputs.has(id)) {
            const output = this.outputs.get(id)!;
            this.outputs.delete(id);
            const event = new MIDIConnectionEvent("statechange", output);
            this.dispatchEvent(event);
            if (this.onstatechange) this.onstatechange(event);
        }
    }
}

function createMockMIDIAccess(): MockMIDIAccess {
    return new MockMIDIAccess();
}

export { MockMIDIInput, MockMIDIOutput, MockMIDIAccess, createMockMIDIAccess };
