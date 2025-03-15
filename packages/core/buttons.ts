import { K2 } from "./K2"

export class Buttons {
    constructor(private k2: K2) {
        this.k2.on('connect', () => {
            console.log('connected')
        })
    }
}