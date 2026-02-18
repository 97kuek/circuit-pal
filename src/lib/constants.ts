export type ResistorColor =
    | "black"
    | "brown"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "violet"
    | "gray"
    | "white"
    | "gold"
    | "silver"
    | "none";

export interface ColorCode {
    color: ResistorColor;
    value: number | null;
    multiplier: number | null;
    tolerance: number | null; // %
    tempCoeff: number | null; // ppm/K
    hex: string;
    textColor: string; // "text-white" or "text-black" for contrast
}

export const RESISTOR_COLORS: ColorCode[] = [
    { color: "black", value: 0, multiplier: 1, tolerance: null, tempCoeff: 250, hex: "#000000", textColor: "text-white" },
    { color: "brown", value: 1, multiplier: 10, tolerance: 1, tempCoeff: 100, hex: "#8B4513", textColor: "text-white" },
    { color: "red", value: 2, multiplier: 100, tolerance: 2, tempCoeff: 50, hex: "#FF0000", textColor: "text-white" },
    { color: "orange", value: 3, multiplier: 1000, tolerance: null, tempCoeff: 15, hex: "#FF8C00", textColor: "text-black" },
    { color: "yellow", value: 4, multiplier: 10000, tolerance: null, tempCoeff: 25, hex: "#FFFF00", textColor: "text-black" },
    { color: "green", value: 5, multiplier: 100000, tolerance: 0.5, tempCoeff: 20, hex: "#008000", textColor: "text-white" },
    { color: "blue", value: 6, multiplier: 1000000, tolerance: 0.25, tempCoeff: 10, hex: "#0000FF", textColor: "text-white" },
    { color: "violet", value: 7, multiplier: 10000000, tolerance: 0.1, tempCoeff: 5, hex: "#800080", textColor: "text-white" },
    { color: "gray", value: 8, multiplier: 100000000, tolerance: 0.05, tempCoeff: 1, hex: "#808080", textColor: "text-white" },
    { color: "white", value: 9, multiplier: 1000000000, tolerance: null, tempCoeff: null, hex: "#FFFFFF", textColor: "text-black" },
    { color: "gold", value: null, multiplier: 0.1, tolerance: 5, tempCoeff: null, hex: "#FFD700", textColor: "text-black" },
    { color: "silver", value: null, multiplier: 0.01, tolerance: 10, tempCoeff: null, hex: "#C0C0C0", textColor: "text-black" },
    { color: "none", value: null, multiplier: null, tolerance: 20, tempCoeff: null, hex: "transparent", textColor: "text-black" },
];

export const VALID_DIGIT_COLORS = RESISTOR_COLORS.filter(c => c.value !== null);
export const VALID_MULTIPLIER_COLORS = RESISTOR_COLORS.filter(c => c.multiplier !== null);
export const VALID_TOLERANCE_COLORS = RESISTOR_COLORS.filter(c => c.tolerance !== null);
export const VALID_TEMP_COEFF_COLORS = RESISTOR_COLORS.filter(c => c.tempCoeff !== null);
