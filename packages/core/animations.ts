import type { K2 } from './K2'
import type { Color } from './controlls'
import { leds } from './controlls'

export class Animations {
    constructor(private k2: K2) { }

    async playStartupAnimation(): Promise<void> {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        const colors: Color[] = ['red', 'green', 'amber']
        const chaserSize = 3
        const totalLeds = leds.length

        for (let i = 0; i < totalLeds; i++) {
            for (let j = 0; j < chaserSize; j++) {
                const ledIndex = (i + j) % totalLeds
                const color = colors[j % colors.length]
                this.k2.highlightLED(leds[ledIndex].name, color)
            }

            await delay(50)

            for (let j = 0; j < chaserSize; j++) {
                const ledIndex = (i + j) % totalLeds
                this.k2.unhighlightLED(leds[ledIndex].name)
            }
        }

        this.k2.unhighlightAllLEDs()
    }
} 