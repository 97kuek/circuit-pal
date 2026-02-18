import { RESISTOR_COLORS, ResistorColor } from "./constants";

export interface ResistanceResult {
    value: number;
    tolerance: number;
    tempCoeff?: number;
}

export function calculateResistance(
    bands: ResistorColor[],
    bandCount: 4 | 5 | 6
): ResistanceResult {
    const colorObjs = bands.map((color) =>
        RESISTOR_COLORS.find((c) => c.color === color)
    );

    if (colorObjs.some((c) => !c)) {
        throw new Error("Invalid color");
    }

    let value = 0;
    let multiplier = 1;
    let tolerance = 20;
    let tempCoeff: number | undefined = undefined;

    // 4 bands: Digit, Digit, Multiplier, Tolerance
    // 5 bands: Digit, Digit, Digit, Multiplier, Tolerance
    // 6 bands: Digit, Digit, Digit, Multiplier, Tolerance, TempCoeff

    if (bandCount === 4) {
        const digit1 = colorObjs[0]?.value ?? 0;
        const digit2 = colorObjs[1]?.value ?? 0;
        multiplier = colorObjs[2]?.multiplier ?? 1;
        tolerance = colorObjs[3]?.tolerance ?? 20;

        value = (digit1 * 10 + digit2) * multiplier;
    } else {
        const digit1 = colorObjs[0]?.value ?? 0;
        const digit2 = colorObjs[1]?.value ?? 0;
        const digit3 = colorObjs[2]?.value ?? 0;
        multiplier = colorObjs[3]?.multiplier ?? 1;
        tolerance = colorObjs[4]?.tolerance ?? 20;

        value = (digit1 * 100 + digit2 * 10 + digit3) * multiplier;

        if (bandCount === 6) {
            tempCoeff = colorObjs[5]?.tempCoeff ?? undefined;
        }
    }

    return { value, tolerance, tempCoeff };
}

export function formatResistance(value: number): string {
    if (value >= 1000000) {
        return `${(value / 1000000).toLocaleString(undefined, { maximumFractionDigits: 2 })}MΩ`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })}kΩ`;
    }
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}Ω`;
}

// Ohm's Law Utils

export interface OhmsLawResult {
    voltage: number | null;
    current: number | null;
    resistance: number | null;
    power: number | null;
}

export function calculateOhmsLaw(
    v: number | null,
    i: number | null,
    r: number | null,
    p: number | null
): OhmsLawResult {
    let voltage = v;
    let current = i;
    let resistance = r;
    let power = p;

    // Need at least 2 inputs
    const inputs = [v, i, r, p].filter(val => val !== null).length;
    if (inputs < 2) {
        return { voltage, current, resistance, power };
    }

    // 1. Given V and I
    if (voltage !== null && current !== null) {
        resistance = voltage / current;
        power = voltage * current;
    }
    // 2. Given V and R
    else if (voltage !== null && resistance !== null) {
        current = voltage / resistance;
        power = (voltage * voltage) / resistance;
    }
    // 3. Given V and P
    else if (voltage !== null && power !== null) {
        current = power / voltage;
        resistance = (voltage * voltage) / power;
    }
    // 4. Given I and R
    else if (current !== null && resistance !== null) {
        voltage = current * resistance;
        power = (current * current) * resistance;
    }
    // 5. Given I and P
    else if (current !== null && power !== null) {
        voltage = power / current;
        resistance = power / (current * current);
    }
    // 6. Given R and P
    else if (resistance !== null && power !== null) {
        voltage = Math.sqrt(power * resistance);
        current = Math.sqrt(power / resistance);
    }

    return { voltage, current, resistance, power };
}

// LED Resistor Utils

export const E24_VALUES = [
    1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1
];

export function getNearestE24(resistance: number): number {
    // Find decade
    if (resistance <= 0) return 0;

    const log10 = Math.log10(resistance);
    const decade = Math.floor(log10);
    const normalized = resistance / Math.pow(10, decade);

    // Find closest in E24
    let closest = E24_VALUES[0];
    let minDiff = Math.abs(normalized - closest);

    for (const val of E24_VALUES) {
        const diff = Math.abs(normalized - val);
        if (diff < minDiff) {
            minDiff = diff;
            closest = val;
        }
    }

    return closest * Math.pow(10, decade);
}

export function calculateLedResistor(
    vs: number,
    vf: number,
    ifwd: number // in Amps
) {
    if (ifwd <= 0) return { r: 0, p: 0, nearest: 0 };
    if (vs <= vf) return { error: "Source voltage must be greater than LED forward voltage." };

    const r = (vs - vf) / ifwd;
    const p = (vs - vf) * ifwd;
    const nearest = getNearestE24(r);

    return { r, p, nearest };
}
