export type ControllName = "forthKnob" | "leftKnob" | "rightKnob";
export type ButtonName =
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F"
    | "G"
    | "H"
    | "I"
    | "J"
    | "K"
    | "L"
    | "M"
    | "N"
    | "O"
    | "P"
    | "layer"
    | "exit-setup"
    | ControllName;

export type Button = {
    name: ButtonName;
    midi: number;
    red: string;
    amber: string;
    green: string;
};

export type StrippedButton = {
    name: ButtonName;
    midi: number;
};

export type Controll = {
    name: ControllName;
    id: number;
};

const colors = ["red", "amber", "green"] as const;
export type Color = (typeof colors)[number];

export const buttons: Button[] = [
    {
        name: "A",
        midi: 36,
        red: "C2",
        amber: "C5",
        green: "C8",
    },
    {
        name: "B",
        midi: 37,
        red: "C#2",
        amber: "C#5",
        green: "C#8",
    },
    {
        name: "C",
        midi: 38,
        red: "D2",
        amber: "D5",
        green: "D8",
    },
    {
        name: "D",
        midi: 39,
        red: "D#2",
        amber: "D#5",
        green: "D#8",
    },
    {
        name: "E",
        midi: 32,
        red: "G#1",
        amber: "G#4",
        green: "G#7",
    },
    {
        name: "F",
        midi: 33,
        red: "A1",
        amber: "A4",
        green: "A7",
    },
    {
        name: "G",
        midi: 34,
        red: "A#1",
        amber: "A#4",
        green: "A#7",
    },
    {
        name: "H",
        midi: 35,
        red: "B1",
        amber: "B4",
        green: "B7",
    },
    {
        name: "I",
        midi: 28,
        red: "E1",
        amber: "E4",
        green: "E7",
    },
    {
        name: "J",
        midi: 29,
        red: "F1",
        amber: "F4",
        green: "F7",
    },
    {
        name: "K",
        midi: 30,
        red: "F#1",
        amber: "F#4",
        green: "F#7",
    },
    {
        name: "L",
        midi: 31,
        red: "G1",
        amber: "G4",
        green: "G7",
    },
    {
        name: "M",
        midi: 24,
        red: "C1",
        amber: "C4",
        green: "C7",
    },
    {
        name: "N",
        midi: 25,
        red: "C#1",
        amber: "C#4",
        green: "C#7",
    },
    {
        name: "O",
        midi: 26,
        red: "D1",
        amber: "D4",
        green: "D7",
    },
    {
        name: "P",
        midi: 27,
        red: "D#1",
        amber: "D#4",
        green: "D#7",
    },
    {
        name: "layer",
        midi: 12,
        red: "C0",
        amber: "E0",
        green: "G#0",
    },
    {
        name: "leftKnob",
        midi: 13,
        red: "",
        amber: "",
        green: "",
    },
    {
        name: "rightKnob",
        midi: 14,
        red: "",
        amber: "",
        green: "",
    },
    {
        name: "exit-setup",
        midi: 15,
        red: "D#0",
        amber: "G0",
        green: "B0",
    },
];

export const controlls: Controll[] = [
    {
        name: "leftKnob",
        id: 20,
    },
    {
        name: "rightKnob",
        id: 21,
    },
    {
        name: "forthKnob",
        id: 3,
    },
];

