import { LEDScenario, type LEDState } from "./LEDScenario";

// Scenario 1: Color Wave - Waves of colors move across all buttons
export class ColorWaveScenario extends LEDScenario {
    private step = 0;
    private readonly colors: ("red" | "green" | "amber")[] = ["red", "green", "amber"];
    private readonly buttonGroups = [
        ["A", "B", "C", "D"],
        ["E", "F", "G", "H"],
        ["I", "J", "K", "L"],
        ["M", "N", "O", "P"],
        ["button-1", "button-2", "button-3", "button-4"],
        ["button-5", "button-6", "button-7", "button-8"],
        ["button-9", "button-10", "button-11", "button-12"],
        ["encoder-1", "encoder-2", "encoder-3", "encoder-4"],
        ["layer", "exit-setup"]
    ];

    constructor() {
        super(
            "Color Wave",
            "Waves of colors moving across all buttons"
        );
    }

    protected onPlay(): void {
        this.interval = setInterval(() => {
            const state: LEDState = {};

            this.buttonGroups.forEach((group, groupIndex) => {
                const colorIndex = (this.step + groupIndex) % this.colors.length;
                group.forEach(button => {
                    state[button] = this.colors[colorIndex];
                });
            });

            this.updateLEDs(state);
            this.step = (this.step + 1) % this.colors.length;
        }, 500);
    }

    protected onPause(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearAllLEDs();
    }
}

// Scenario 2: Chaser - Light chases through all LEDs in a sequence
export class ChaserScenario extends LEDScenario {
    private step = 0;
    private readonly allButtons = [
        // Lettered buttons in a zigzag pattern
        "A", "B", "C", "D",
        "H", "G", "F", "E",
        "I", "J", "K", "L",
        "P", "O", "N", "M",

        // Number buttons in zigzag
        "button-1", "button-2", "button-3", "button-4",
        "button-8", "button-7", "button-6", "button-5",
        "button-9", "button-10", "button-11", "button-12",

        // Encoder buttons
        "encoder-1", "encoder-2", "encoder-3", "encoder-4",

        // Special buttons
        "layer", "exit-setup"
    ];

    constructor() {
        super(
            "Chaser",
            "Light chases through all LEDs in sequence"
        );
    }

    protected onPlay(): void {
        this.interval = setInterval(() => {
            const state: LEDState = {};
            const totalButtons = this.allButtons.length;

            // Turn off all LEDs initially
            this.allButtons.forEach(button => {
                state[button] = "off";
            });

            // Create a trailing effect with 5 LEDs lit at once
            for (let i = 0; i < 5; i++) {
                const position = (this.step + i) % totalButtons;

                // Use different colors based on position in the tail
                if (i === 0) {
                    // Head of the chaser
                    state[this.allButtons[position]] = "green";
                } else if (i === 4) {
                    // Tail of the chaser
                    state[this.allButtons[position]] = "red";
                } else {
                    // Middle of the chaser
                    state[this.allButtons[position]] = "amber";
                }
            }

            this.updateLEDs(state);
            this.step = (this.step + 1) % totalButtons;
        }, 100); // Faster speed for smoother animation
    }

    protected onPause(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearAllLEDs();
    }
}

// Scenario 3: Random Blink - Random buttons light up in random colors
export class RandomBlinkScenario extends LEDScenario {
    private readonly allButtons = [
        "A", "B", "C", "D", "E", "F", "G", "H",
        "I", "J", "K", "L", "M", "N", "O", "P",
        "button-1", "button-2", "button-3", "button-4",
        "button-5", "button-6", "button-7", "button-8",
        "button-9", "button-10", "button-11", "button-12",
        "encoder-1", "encoder-2", "encoder-3", "encoder-4",
        "layer", "exit-setup"
    ];
    private readonly colors: ("red" | "green" | "amber")[] = ["red", "green", "amber"];

    constructor() {
        super(
            "Random Blink",
            "Random buttons light up in random colors"
        );
    }

    protected onPlay(): void {
        this.interval = setInterval(() => {
            const state: LEDState = {};

            // Turn some random buttons on with random colors
            const numToLight = 5 + Math.floor(Math.random() * 10); // Between 5-15 buttons

            for (let i = 0; i < numToLight; i++) {
                const buttonIndex = Math.floor(Math.random() * this.allButtons.length);
                const colorIndex = Math.floor(Math.random() * this.colors.length);
                state[this.allButtons[buttonIndex]] = this.colors[colorIndex];
            }

            this.updateLEDs(state);
        }, 200);
    }

    protected onPause(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearAllLEDs();
    }
}

// Scenario 4: Pulse - All LEDs pulse on and off in synchronized pattern
export class PulseScenario extends LEDScenario {
    private step = 0;
    private readonly steps = 10; // Number of steps in the pulse animation
    private readonly allButtons = [
        "A", "B", "C", "D", "E", "F", "G", "H",
        "I", "J", "K", "L", "M", "N", "O", "P",
        "button-1", "button-2", "button-3", "button-4",
        "button-5", "button-6", "button-7", "button-8",
        "button-9", "button-10", "button-11", "button-12",
        "encoder-1", "encoder-2", "encoder-3", "encoder-4",
        "layer", "exit-setup"
    ];

    constructor() {
        super(
            "Pulse",
            "All LEDs pulse on and off in a synchronized pattern"
        );
    }

    protected onPlay(): void {
        this.interval = setInterval(() => {
            const state: LEDState = {};

            // Every other step, toggle between all on and all off
            const isOn = this.step % 2 === 0;
            const color = isOn ? "amber" : "off";

            this.allButtons.forEach(button => {
                state[button] = color;
            });

            this.updateLEDs(state);
            this.step = (this.step + 1) % this.steps;
        }, 400);
    }

    protected onPause(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearAllLEDs();
    }
}

// Scenario 5: Color Transition - Smooth transition between colors for all LEDs
export class ColorTransitionScenario extends LEDScenario {
    private step = 0;
    private readonly steps = 3; // Number of colors
    private readonly colors: ("red" | "green" | "amber")[] = ["red", "green", "amber"];
    private readonly allButtons = [
        "A", "B", "C", "D", "E", "F", "G", "H",
        "I", "J", "K", "L", "M", "N", "O", "P",
        "button-1", "button-2", "button-3", "button-4",
        "button-5", "button-6", "button-7", "button-8",
        "button-9", "button-10", "button-11", "button-12",
        "encoder-1", "encoder-2", "encoder-3", "encoder-4",
        "layer", "exit-setup"
    ];

    constructor() {
        super(
            "Color Transition",
            "All LEDs transition through colors together"
        );
    }

    protected onPlay(): void {
        this.interval = setInterval(() => {
            const state: LEDState = {};
            const currentColor = this.colors[this.step % this.colors.length];

            this.allButtons.forEach(button => {
                state[button] = currentColor;
            });

            this.updateLEDs(state);
            this.step = (this.step + 1) % this.steps;
        }, 1000);
    }

    protected onPause(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearAllLEDs();
    }
}

// Scenario 6: Matrix Rain - Inspired by the digital rain effect from The Matrix
export class MatrixRainScenario extends LEDScenario {
    private columns: number[] = [];
    private readonly columnMap = [
        ["A", "E", "I", "M"], // Column 1
        ["B", "F", "J", "N"], // Column 2
        ["C", "G", "K", "O"], // Column 3
        ["D", "H", "L", "P"], // Column 4
        ["button-1", "button-5", "button-9"], // Column 5
        ["button-2", "button-6", "button-10"], // Column 6
        ["button-3", "button-7", "button-11"], // Column 7
        ["button-4", "button-8", "button-12"], // Column 8
        ["encoder-1", "encoder-2", "encoder-3", "encoder-4"], // Row of encoders
        ["layer", "exit-setup"]
    ];

    constructor() {
        super(
            "Matrix Rain",
            "Digital rain effect with cascading green lights"
        );

        // Initialize columns with random positions
        this.resetColumns();
    }

    private resetColumns(): void {
        // For each column, assign a random position as starting point
        this.columns = this.columnMap.map(() =>
            Math.floor(Math.random() * 4) - 4 // Start above visible area
        );
    }

    protected onPlay(): void {
        this.resetColumns();

        this.interval = setInterval(() => {
            const state: LEDState = {};

            // Process each column
            this.columnMap.forEach((column, colIndex) => {
                const dropPosition = this.columns[colIndex];

                // Light up the current position if it's in bounds
                if (dropPosition >= 0 && dropPosition < column.length) {
                    state[column[dropPosition]] = "green";

                    // Fade trail
                    if (dropPosition > 0 && dropPosition < column.length) {
                        state[column[dropPosition - 1]] = "amber";
                    }
                }

                // Advance the drop
                this.columns[colIndex]++;

                // If the drop has reached the bottom, reset it
                if (this.columns[colIndex] >= column.length + 1) {
                    this.columns[colIndex] = Math.floor(Math.random() * 4) - 4; // Random start above visible area
                }
            });

            this.updateLEDs(state);
        }, 150);
    }

    protected onPause(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearAllLEDs();
    }
}

// Scenario 7: Heartbeat - Simulates a heartbeat pattern
export class HeartbeatScenario extends LEDScenario {
    private beatStep = 0;
    private readonly beatSteps = 12; // Complete heartbeat cycle
    private readonly allButtons = [
        "A", "B", "C", "D", "E", "F", "G", "H",
        "I", "J", "K", "L", "M", "N", "O", "P",
        "button-1", "button-2", "button-3", "button-4",
        "button-5", "button-6", "button-7", "button-8",
        "button-9", "button-10", "button-11", "button-12",
        "encoder-1", "encoder-2", "encoder-3", "encoder-4",
        "layer", "exit-setup"
    ];

    constructor() {
        super(
            "Heartbeat",
            "Simulates a cardiac rhythm with pulsing red lights"
        );
    }

    protected onPlay(): void {
        this.interval = setInterval(() => {
            const state: LEDState = {};

            // Different phases of the heartbeat
            if (this.beatStep === 0 || this.beatStep === 1) {
                // First beat
                this.allButtons.forEach(button => {
                    state[button] = "red";
                });
            } else if (this.beatStep === 2) {
                // Pause between beats
                this.allButtons.forEach(button => {
                    state[button] = "off";
                });
            } else if (this.beatStep === 3 || this.beatStep === 4) {
                // Second beat
                this.allButtons.forEach(button => {
                    state[button] = "red";
                });
            } else {
                // Long pause before next beat
                this.allButtons.forEach(button => {
                    state[button] = "off";
                });
            }

            this.updateLEDs(state);
            this.beatStep = (this.beatStep + 1) % this.beatSteps;
        }, 150);
    }

    protected onPause(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearAllLEDs();
    }
}

// Scenario 8: Spiral - Lights spiral inward from the outer buttons
export class SpiralScenario extends LEDScenario {
    private step = 0;
    private readonly spiralSteps = 5; // Represents different rings of the spiral
    private readonly spiralRings = [
        // Outer ring - perimeter buttons
        ["A", "B", "C", "D", "H", "L", "P", "O", "N", "M", "I", "E"],
        // Second ring - inner lettered buttons
        ["F", "G", "K", "J"],
        // Third ring - numbered buttons outer
        ["button-1", "button-2", "button-3", "button-4", "button-8", "button-12", "button-11", "button-10", "button-9", "button-5"],
        // Fourth ring - numbered buttons inner
        ["button-6", "button-7"],
        // Center - encoders and special buttons
        ["encoder-1", "encoder-2", "encoder-3", "encoder-4", "layer", "exit-setup"]
    ];

    constructor() {
        super(
            "Spiral",
            "Lights spiral from the outer edge to the center"
        );
    }

    protected onPlay(): void {
        this.interval = setInterval(() => {
            const state: LEDState = {};

            // Determine which ring should be lit
            const activeRingIndex = this.step % this.spiralSteps;

            // Apply different colors to different rings for visual interest
            const colors: ("red" | "green" | "amber")[] = ["amber", "red", "green", "amber", "red"];

            // Light up all buttons in the active ring
            for (let i = 0; i < this.spiralRings.length; i++) {
                const color = i === activeRingIndex ? colors[i] : "off";
                this.spiralRings[i].forEach(button => {
                    state[button] = color;
                });
            }

            this.updateLEDs(state);
            this.step = (this.step + 1) % this.spiralSteps;
        }, 250);
    }

    protected onPause(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearAllLEDs();
    }
}

// Scenario 9: Simon Says - Classic memory game pattern
export class SimonSaysScenario extends LEDScenario {
    private sequence: string[] = [];
    private readonly colorSequence: ("red" | "green" | "amber")[] = ["red", "green", "amber", "red"];
    private step = 0;
    private readonly quadrants = [
        ["A", "B", "E", "F", "I", "J"], // Top-left
        ["C", "D", "G", "H", "K", "L"], // Top-right
        ["M", "N", "button-1", "button-2", "button-5", "button-6", "button-9", "button-10"], // Bottom-left
        ["O", "P", "button-3", "button-4", "button-7", "button-8", "button-11", "button-12"] // Bottom-right
    ];
    private readonly centerButtons = ["encoder-1", "encoder-2", "encoder-3", "encoder-4", "layer", "exit-setup"];

    constructor() {
        super(
            "Simon Says",
            "Classic memory game light pattern"
        );
    }

    protected onPlay(): void {
        // Generate a random sequence
        this.sequence = Array.from({ length: 20 }, () => Math.floor(Math.random() * 4).toString());
        this.step = 0;

        this.interval = setInterval(() => {
            const state: LEDState = {};

            // Every other step, show a quadrant
            if (this.step % 2 === 0) {
                const quadrantIndex = parseInt(this.sequence[Math.floor(this.step / 2) % this.sequence.length]);
                const colorIndex = Math.floor(this.step / 8) % this.colorSequence.length;

                // Light up the selected quadrant
                this.quadrants[quadrantIndex].forEach(button => {
                    state[button] = this.colorSequence[colorIndex];
                });

                // Always keep center lit with different color
                this.centerButtons.forEach(button => {
                    state[button] = this.colorSequence[(colorIndex + 1) % this.colorSequence.length];
                });
            }

            this.updateLEDs(state);
            this.step = (this.step + 1);
        }, 300);
    }

    protected onPause(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearAllLEDs();
    }
}

// Scenario 10: Equalizer - Simulates an audio equalizer display
export class EqualizerScenario extends LEDScenario {
    private step = 0;
    private readonly columns = [
        ["M", "I", "E", "A"], // Column 1
        ["N", "J", "F", "B"], // Column 2
        ["O", "K", "G", "C"], // Column 3
        ["P", "L", "H", "D"], // Column 4
        ["button-9", "button-5", "button-1"], // Column 5
        ["button-10", "button-6", "button-2"], // Column 6
        ["button-11", "button-7", "button-3"], // Column 7
        ["button-12", "button-8", "button-4"], // Column 8
    ];
    private readonly specialButtons = ["encoder-1", "encoder-2", "encoder-3", "encoder-4", "layer", "exit-setup"];
    private levels: number[] = [];

    constructor() {
        super(
            "Equalizer",
            "Audio visualizer-style vertical bar display"
        );

        // Initialize with random levels
        this.resetLevels();
    }

    private resetLevels(): void {
        this.levels = Array.from({ length: this.columns.length }, () =>
            Math.floor(Math.random() * 4)
        );
    }

    protected onPlay(): void {
        this.interval = setInterval(() => {
            const state: LEDState = {};

            // Update levels with some randomness but smooth transitions
            this.levels = this.levels.map(level => {
                const change = Math.random() > 0.5 ? 1 : -1;
                let newLevel = level + change;

                // Keep in bounds
                if (newLevel < 0) newLevel = 0;
                if (newLevel > 4) newLevel = 4;

                return newLevel;
            });

            // Apply levels to columns
            this.columns.forEach((column, columnIndex) => {
                const level = this.levels[columnIndex];

                column.forEach((button, buttonIndex) => {
                    // Light from bottom up
                    const isLit = buttonIndex < level;

                    // Different colors based on level and position
                    let color: "off" | "red" | "green" | "amber" = "off";

                    if (isLit) {
                        if (buttonIndex === 3) {
                            color = "red"; // Top level is red
                        } else if (buttonIndex === 2) {
                            color = "amber"; // Second level is amber
                        } else {
                            color = "green"; // Lower levels are green
                        }
                    }

                    state[button] = color;
                });
            });

            // Animate special buttons based on step
            this.specialButtons.forEach((button, index) => {
                const colorIndex = (this.step + index) % 3;
                const colors: ("red" | "green" | "amber")[] = ["red", "green", "amber"];
                state[button] = colors[colorIndex];
            });

            this.updateLEDs(state);
            this.step = (this.step + 1);
        }, 180);
    }

    protected onPause(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearAllLEDs();
    }
}

// Scenario 11: Fireworks - Simulates firework explosions
export class FireworksScenario extends LEDScenario {
    private explosions: { center: string, radius: number, age: number, color: "red" | "green" | "amber" }[] = [];
    private step = 0;
    private readonly allButtons = [
        "A", "B", "C", "D", "E", "F", "G", "H",
        "I", "J", "K", "L", "M", "N", "O", "P",
        "button-1", "button-2", "button-3", "button-4",
        "button-5", "button-6", "button-7", "button-8",
        "button-9", "button-10", "button-11", "button-12",
        "encoder-1", "encoder-2", "encoder-3", "encoder-4",
        "layer", "exit-setup"
    ];

    // Map of distances between buttons
    private buttonDistances: Record<string, Record<string, number>> = {};

    constructor() {
        super(
            "Fireworks",
            "Explosive light patterns that burst and fade"
        );

        // Pre-compute approximate distances between buttons
        this.initializeDistances();
    }

    private initializeDistances(): void {
        // Define coordinates for each button in a virtual grid
        const positions: Record<string, [number, number]> = {
            // Lettered buttons (4x4 grid)
            "A": [0, 0], "B": [1, 0], "C": [2, 0], "D": [3, 0],
            "E": [0, 1], "F": [1, 1], "G": [2, 1], "H": [3, 1],
            "I": [0, 2], "J": [1, 2], "K": [2, 2], "L": [3, 2],
            "M": [0, 3], "N": [1, 3], "O": [2, 3], "P": [3, 3],

            // Numbered buttons (4x3 grid)
            "button-1": [4, 0], "button-2": [5, 0], "button-3": [6, 0], "button-4": [7, 0],
            "button-5": [4, 1], "button-6": [5, 1], "button-7": [6, 1], "button-8": [7, 1],
            "button-9": [4, 2], "button-10": [5, 2], "button-11": [6, 2], "button-12": [7, 2],

            // Encoders and special buttons
            "encoder-1": [0, 4], "encoder-2": [1, 4], "encoder-3": [2, 4], "encoder-4": [3, 4],
            "layer": [5, 4], "exit-setup": [6, 4]
        };

        // Calculate distances
        this.allButtons.forEach(button1 => {
            this.buttonDistances[button1] = {};

            this.allButtons.forEach(button2 => {
                if (button1 !== button2 && positions[button1] && positions[button2]) {
                    const [x1, y1] = positions[button1];
                    const [x2, y2] = positions[button2];

                    // Euclidean distance
                    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    this.buttonDistances[button1][button2] = distance;
                }
            });
        });
    }

    private createExplosion(): void {
        // Create a new explosion with random center and color
        const centerIndex = Math.floor(Math.random() * this.allButtons.length);
        const center = this.allButtons[centerIndex];

        const colors: ("red" | "green" | "amber")[] = ["red", "green", "amber"];
        const colorIndex = Math.floor(Math.random() * colors.length);

        this.explosions.push({
            center,
            radius: 0,  // Starts at radius 0
            age: 0,     // New explosion
            color: colors[colorIndex]
        });
    }

    protected onPlay(): void {
        this.explosions = [];

        this.interval = setInterval(() => {
            const state: LEDState = {};

            // Randomly create new explosions
            if (Math.random() < 0.1 && this.explosions.length < 3) {
                this.createExplosion();
            }

            // Update and render all explosions
            this.explosions = this.explosions
                .map(explosion => {
                    // Age the explosion
                    explosion.age++;

                    // Grow the radius for the first few steps, then keep stable
                    if (explosion.age < 5) {
                        explosion.radius += 0.8;
                    }

                    return explosion;
                })
                .filter(explosion => explosion.age < 15) // Remove old explosions
                .map(explosion => {
                    // Apply the explosion effect to buttons
                    this.allButtons.forEach(button => {
                        // Skip if already set by another explosion
                        if (state[button]) return;

                        // Center button is always lit with the explosion color
                        if (button === explosion.center) {
                            state[button] = explosion.color;
                            return;
                        }

                        // Calculate if this button should be lit based on distance from center
                        const distance = this.buttonDistances[explosion.center]?.[button] || 100;

                        // Buttons within the explosion radius get lit
                        const radiusLower = explosion.radius - 0.8;
                        const radiusUpper = explosion.radius;

                        if (distance <= radiusUpper && distance >= radiusLower) {
                            // Color depends on age - fades from bright to dim
                            if (explosion.age < 5) {
                                state[button] = explosion.color;
                            } else if (explosion.age < 10) {
                                state[button] = explosion.color === "red" ? "amber" :
                                    explosion.color === "amber" ? "green" : "amber";
                            } else {
                                state[button] = "amber"; // Final fade before disappearing
                            }
                        }
                    });

                    return explosion;
                });

            this.updateLEDs(state);
            this.step++;
        }, 100);
    }

    protected onPause(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearAllLEDs();
    }
}

// Scenario 12: Text Marquee - Simulates scrolling text
export class TextMarqueeScenario extends LEDScenario {
    private step = 0;
    private readonly message = "K2"; // Message to display
    private readonly fontMap: Record<string, boolean[][]> = {
        'K': [
            [true, false, true],
            [true, true, false],
            [true, false, true]
        ],
        '2': [
            [true, true, true],
            [false, false, true],
            [true, true, true],
            [true, false, false],
            [true, true, true]
        ]
    };
    private readonly displayGrid: string[][] = [
        ["A", "B", "C", "D"],
        ["E", "F", "G", "H"],
        ["I", "J", "K", "L"],
        ["M", "N", "O", "P"]
    ];
    private readonly additionalButtons = [
        "button-1", "button-2", "button-3", "button-4",
        "button-5", "button-6", "button-7", "button-8",
        "button-9", "button-10", "button-11", "button-12",
        "encoder-1", "encoder-2", "encoder-3", "encoder-4",
        "layer", "exit-setup"
    ];

    constructor() {
        super(
            "Text Marquee",
            "Scrolling text animation using LED grid"
        );
    }

    protected onPlay(): void {
        this.interval = setInterval(() => {
            const state: LEDState = {};

            // Clear the entire display
            [...this.displayGrid.flat(), ...this.additionalButtons].forEach(button => {
                state[button] = "off";
            });

            // Current character index in message
            const charIndex = Math.floor(this.step / 4) % this.message.length;
            const char = this.message[charIndex];

            // Offset within the character
            const offsetX = this.step % 4;

            // If character has a font definition
            if (this.fontMap[char]) {
                const font = this.fontMap[char];

                // Render the character onto the grid
                font.forEach((row, rowIndex) => {
                    if (rowIndex < this.displayGrid.length) {
                        row.forEach((isLit, colIndex) => {
                            const displayCol = colIndex - offsetX;

                            if (displayCol >= 0 && displayCol < this.displayGrid[0].length && isLit) {
                                const buttonId = this.displayGrid[rowIndex][displayCol];
                                state[buttonId] = "green";
                            }
                        });
                    }
                });
            }

            // Create a pulsing border effect with the additional buttons
            const pulseColor = this.step % 6 < 3 ? "amber" : "red";
            this.additionalButtons.forEach(button => {
                state[button] = pulseColor;
            });

            this.updateLEDs(state);
            this.step = (this.step + 1);
        }, 300);
    }

    protected onPause(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.clearAllLEDs();
    }
}

// Create and export all scenarios
export const scenarios = [
    new ColorWaveScenario(),
    new ChaserScenario(),
    new RandomBlinkScenario(),
    new PulseScenario(),
    new ColorTransitionScenario(),
    new MatrixRainScenario(),
    new HeartbeatScenario(),
    new SpiralScenario(),
    new SimonSaysScenario(),
    new EqualizerScenario(),
    new FireworksScenario(),
    new TextMarqueeScenario()
]; 