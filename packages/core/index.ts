import { K2 } from "./K2";
import type { Channel } from "./types";
import { BrowserMIDIProvider } from "./BrowserMIDIProvider/index";
import type { MIDIProvider } from "./interfaces/MIDIProvider";
import type { ButtonName, Color } from "./controlls";
import type { KnobEvent, FaderEvent, EncoderEvent } from "./K2";

export { BrowserMIDIProvider, K2 };
export type {
    Channel,
    MIDIProvider,
    ButtonName,
    Color,
    KnobEvent,
    FaderEvent,
    EncoderEvent
};

export function createK2(channel: Channel, provider: MIDIProvider) {
    return new K2(channel, provider)
}

