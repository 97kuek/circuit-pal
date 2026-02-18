export interface VoltageDividerResult {
    vout: number;
    r1?: number;
    r2?: number;
}

// Find nearest E24 value
const E24_VALUES = [
    1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1
];

export function findNearestE24(resistance: number): number {
    if (resistance <= 0) return 0;

    const exponent = Math.floor(Math.log10(resistance));
    const mantissa = resistance / Math.pow(10, exponent);

    let closest = E24_VALUES[0];
    let minDiff = Math.abs(mantissa - closest);

    for (const val of E24_VALUES) {
        const diff = Math.abs(mantissa - val);
        if (diff < minDiff) {
            minDiff = diff;
            closest = val;
        }
    }

    return closest * Math.pow(10, exponent);
}

export function calculateVoltageDivider(vin: number, r1: number, r2: number): number {
    if (r1 + r2 === 0) return 0;
    return vin * (r2 / (r1 + r2));
}

export function calculateRequiredR2(vin: number, vout: number, r1: number): number {
    if (vout >= vin || vout <= 0) return 0;
    // Vout = Vin * (R2 / (R1 + R2))
    // Vout * (R1 + R2) = Vin * R2
    // Vout*R1 + Vout*R2 = Vin*R2
    // Vout*R1 = R2(Vin - Vout)
    // R2 = (Vout * R1) / (Vin - Vout)
    return (vout * r1) / (vin - vout);
}
