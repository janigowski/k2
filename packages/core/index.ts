import { K2 } from "./K2";
import type { Channel } from "./types";


export function createK2(channel: Channel) {
    return new K2(channel)
}

