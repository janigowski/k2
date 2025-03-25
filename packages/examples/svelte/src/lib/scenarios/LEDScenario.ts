import type { K2 } from "../../../../../core/K2";
import type { LedName } from "../../../../../core/controlls";

export type LEDColor = "off" | "red" | "green" | "amber";
export type LEDState = Record<string, LEDColor>;

export abstract class LEDScenario {
    public name: string;
    public description: string;
    protected interval: ReturnType<typeof setInterval> | null = null;
    protected isPlaying = false;
    protected k2: K2 | null = null;
    protected updateCallback: ((ledState: LEDState) => void) | null = null;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    setK2(k2: K2): this {
        this.k2 = k2;
        return this;
    }

    setUpdateCallback(callback: (ledState: LEDState) => void): this {
        this.updateCallback = callback;
        return this;
    }

    play(): void {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.onPlay();
    }

    pause(): void {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        this.onPause();
    }

    protected abstract onPlay(): void;
    protected abstract onPause(): void;

    // Helper method to update both the physical device and UI
    protected updateLEDs(ledState: LEDState): void {
        if (!this.k2 || !this.updateCallback) return;

        // Update UI
        this.updateCallback(ledState);

        // Update physical device
        Object.entries(ledState).forEach(([ledId, color]) => {
            if (color === "off") {
                this.k2?.unhighlightLED(ledId as LedName);
            } else {
                this.k2?.highlightLED(ledId as LedName, color);
            }
        });
    }

    // Helper to turn off all LEDs
    protected clearAllLEDs(): void {
        if (!this.k2) return;

        this.k2.unhighlightAllLEDs();

        // Create an "all off" state for the UI
        const allOffState: LEDState = {};

        // Add all possible LEDs to the state
        ["encoder-1", "encoder-2", "encoder-3", "encoder-4"].forEach(id => {
            allOffState[id] = "off";
        });

        // Add lettered buttons
        "ABCDEFGHIJKLMNOP".split("").forEach(letter => {
            allOffState[letter] = "off";
        });

        // Add numbered buttons
        Array.from({ length: 12 }, (_, i) => `button-${i + 1}`).forEach(id => {
            allOffState[id] = "off";
        });

        // Add special buttons
        allOffState["layer"] = "off";
        allOffState["exit-setup"] = "off";

        // Update UI
        if (this.updateCallback) {
            this.updateCallback(allOffState);
        }
    }
} 