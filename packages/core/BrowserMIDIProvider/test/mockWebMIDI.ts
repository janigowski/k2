// test/mockWebMIDI.ts

export class MIDIConnectionEvent extends Event implements WebMidi.MIDIConnectionEvent {
    port: WebMidi.MIDIPort;

    constructor(type: string, port: WebMidi.MIDIPort) {
        super(type);
        this.port = port;
    }
}

export class MIDIMessageEvent extends Event implements WebMidi.MIDIMessageEvent {
    data: Uint8Array;

    constructor(type: string, eventInitDict: { data: Uint8Array }) {
        super(type);
        this.data = eventInitDict.data;
    }
}

export class MockMIDIInput extends EventTarget {
    id: string;
    manufacturer: string;
    name: string;
    readonly type: "input" = "input";
    version: string = "1.0.0";
    state: "connected" | "disconnected" = "connected";
    connection: "open" | "closed" | "pending" = "closed";
    onmidimessage: ((this: WebMidi.MIDIInput, e: WebMidi.MIDIMessageEvent) => void) | null = null;
    onstatechange: ((this: WebMidi.MIDIInput, e: WebMidi.MIDIConnectionEvent) => void) | null = null;

    constructor(id: string, name: string) {
        super();
        this.id = id;
        this.name = name;
        this.manufacturer = "Mock Manufacturer";
    }

    open(): Promise<WebMidi.MIDIPort> {
        this.connection = "open";
        this.state = "connected";
        return Promise.resolve(this as unknown as WebMidi.MIDIPort);
    }

    close(): Promise<WebMidi.MIDIPort> {
        this.connection = "closed";
        this.state = "disconnected";
        return Promise.resolve(this as unknown as WebMidi.MIDIPort);
    }

    // Custom method to simulate receiving MIDI messages
    receiveMIDIMessage(data: number[]): void {
        const event = new MIDIMessageEvent("midimessage", {
            data: new Uint8Array(data)
        });

        if (this.onmidimessage) {
            this.onmidimessage.call(this as unknown as WebMidi.MIDIInput, event);
        }

        this.dispatchEvent(event);
    }
}

// TypeScript cast to assert that our class satisfies the WebMidi.MIDIInput interface
(MockMIDIInput.prototype as any as WebMidi.MIDIInput);

export class MockMIDIOutput extends EventTarget {
    id: string;
    manufacturer: string = "Mock Manufacturer";
    name: string;
    readonly type: "output" = "output";
    version: string = "1.0.0";
    state: "connected" | "disconnected" = "connected";
    connection: "open" | "closed" | "pending" = "closed";
    onstatechange: ((this: WebMidi.MIDIOutput, e: WebMidi.MIDIConnectionEvent) => void) | null = null;

    constructor(id: string, name: string) {
        super();
        this.id = id;
        this.name = name;
    }

    open(): Promise<WebMidi.MIDIPort> {
        this.connection = "open";
        this.state = "connected";
        return Promise.resolve(this as unknown as WebMidi.MIDIPort);
    }

    close(): Promise<WebMidi.MIDIPort> {
        this.connection = "closed";
        this.state = "disconnected";
        return Promise.resolve(this as unknown as WebMidi.MIDIPort);
    }

    send(data: Uint8Array | number[]): void {
    }

    clear(): void {
    }
}

// TypeScript cast to assert that our class satisfies the WebMidi.MIDIOutput interface
(MockMIDIOutput.prototype as any as WebMidi.MIDIOutput);

export class MockMIDIAccess extends EventTarget {
    inputs: WebMidi.MIDIInputMap;
    outputs: WebMidi.MIDIOutputMap;
    onstatechange: ((this: WebMidi.MIDIAccess, e: WebMidi.MIDIConnectionEvent) => void) | null = null;
    sysexEnabled: boolean = false;

    private _inputs: Map<string, MockMIDIInput>;
    private _outputs: Map<string, MockMIDIOutput>;

    constructor(options?: WebMidi.MIDIOptions) {
        super();
        this._inputs = new Map();
        this._outputs = new Map();

        // Cast our mutable maps to readonly maps for the interface
        this.inputs = this._inputs as unknown as WebMidi.MIDIInputMap;
        this.outputs = this._outputs as unknown as WebMidi.MIDIOutputMap;

        if (options) {
            this.sysexEnabled = !!options.sysex;
        }

        // Default devices
        this.addInput("input-1", "Mock MIDI Input 1");
        this.addOutput("output-1", "Mock MIDI Output 1");
    }

    addInput(id: string, name: string): void {
        const input = new MockMIDIInput(id, name);
        this._inputs.set(id, input);
        const event = new MIDIConnectionEvent("statechange", input as unknown as WebMidi.MIDIPort);
        this.dispatchEvent(event);
        if (this.onstatechange) {
            this.onstatechange.call(this as unknown as WebMidi.MIDIAccess, event);
        }
    }

    addOutput(id: string, name: string): void {
        const output = new MockMIDIOutput(id, name);
        this._outputs.set(id, output);
        const event = new MIDIConnectionEvent("statechange", output as unknown as WebMidi.MIDIPort);
        this.dispatchEvent(event);
        if (this.onstatechange) {
            this.onstatechange.call(this as unknown as WebMidi.MIDIAccess, event);
        }
    }

    removeInput(id: string): void {
        if (this._inputs.has(id)) {
            const input = this._inputs.get(id)!;
            this._inputs.delete(id);
            const event = new MIDIConnectionEvent("statechange", input as unknown as WebMidi.MIDIPort);
            this.dispatchEvent(event);
            if (this.onstatechange) {
                this.onstatechange.call(this as unknown as WebMidi.MIDIAccess, event);
            }
        }
    }

    removeOutput(id: string): void {
        if (this._outputs.has(id)) {
            const output = this._outputs.get(id)!;
            this._outputs.delete(id);
            const event = new MIDIConnectionEvent("statechange", output as unknown as WebMidi.MIDIPort);
            this.dispatchEvent(event);
            if (this.onstatechange) {
                this.onstatechange.call(this as unknown as WebMidi.MIDIAccess, event);
            }
        }
    }
}

// TypeScript cast to assert that our class satisfies the WebMidi.MIDIAccess interface
(MockMIDIAccess.prototype as any as WebMidi.MIDIAccess);

export function createMockMIDIAccess(options?: WebMidi.MIDIOptions): MockMIDIAccess {
    return new MockMIDIAccess(options);
}
