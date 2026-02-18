
export interface TimerCalculation {
    frequency?: number; // Hz
    period?: number; // seconds
    dutyCycle?: number; // percentage (0-100)
    highTime?: number; // seconds
    lowTime?: number; // seconds
}

export function calculateAstable(r1: number, r2: number, c: number): TimerCalculation {
    // Inputs: R1 (Ohms), R2 (Ohms), C (Farads)
    // t_high = 0.693 * (R1 + R2) * C
    // t_low = 0.693 * R2 * C
    // Period = t_high + t_low
    // Frequency = 1.44 / ((R1 + 2*R2) * C)
    // Duty Cycle = (t_high / period) * 100

    const tHigh = 0.693 * (r1 + r2) * c;
    const tLow = 0.693 * r2 * c;
    const period = tHigh + tLow;
    const frequency = 1 / period;
    const dutyCycle = (tHigh / period) * 100;

    return {
        frequency,
        period,
        dutyCycle,
        highTime: tHigh,
        lowTime: tLow
    };
}

export function calculateMonostable(r: number, c: number): TimerCalculation {
    // Inputs: R (Ohms), C (Farads)
    // t_out = 1.1 * R * C

    const tOut = 1.1 * r * c;

    return {
        highTime: tOut
    };
}
