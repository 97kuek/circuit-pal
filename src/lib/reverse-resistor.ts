import { ColorCode, RESISTOR_COLORS } from "./constants";

export function getColorsFromResistance(resistance: number, bands: 4 | 5): string[] {
    if (resistance <= 0) return [];

    // Convert to standard form: digits * 10^multiplier
    // e.g. 4700 -> 4, 7, multiplier=2 (100)
    // 4750 -> 4, 7, 5, multiplier=1 (10)

    let magnitude = Math.floor(Math.log10(resistance));
    let normalized = resistance / Math.pow(10, magnitude);

    // Adjust if normalized < 1 (shouldn't happen with log10 logic usually unless <1 ohm)
    // if resistance < 1, magnitude is negative.
    // e.g. 0.22 -> log10 is -0.65 -> floor -1. Norm = 2.2.
    // We want integer digits.

    // For 4 bands: 2 digits.
    // For 5 bands: 3 digits.

    let multiplier = magnitude;
    let digitsVal = normalized;

    // Adjust to get 2 or 3 integer digits
    if (bands === 4) {
        // Need 2 significant digits. 
        // 4.7k -> 4700. Mag 3. Norm 4.7.
        // We want 47 * 10^2.
        // So shift decimal.
        while (digitsVal < 10) {
            digitsVal *= 10;
            multiplier -= 1;
        }
        // Round to nearest integer (standard E24 logic would be better but this is "reverse calc")
        digitsVal = Math.round(digitsVal);
        // If rounding bumped us up (e.g. 9.9 -> 10), adjust
        if (digitsVal >= 100) {
            digitsVal /= 10;
            multiplier += 1;
        }
    } else {
        // 5 bands -> 3 significant digits
        while (digitsVal < 100) {
            digitsVal *= 10;
            multiplier -= 1;
        }
        digitsVal = Math.round(digitsVal);
        if (digitsVal >= 1000) {
            digitsVal /= 10;
            multiplier += 1;
        }
    }

    // Extract digit colors
    const digitStr = digitsVal.toString();
    const colors: string[] = [];

    for (let i = 0; i < digitStr.length; i++) {
        const d = parseInt(digitStr[i]);
        const c = RESISTOR_COLORS.find(rc => rc.value === d);
        if (c) colors.push(c.color);
    }

    // Multiplier color
    const multColor = RESISTOR_COLORS.find(rc => rc.multiplier === Math.pow(10, multiplier));
    // If multiplier is very small/large, might not exist in standard list?
    // standard range: 0.01 (-2) to 1G (9).
    // Our multiplier calculated above might need adjustment?
    // Ex: 100 ohm. 4 band.
    // 100 -> mag 2. norm 1.0.
    // 4 bands -> need 2 digits -> 10. (val 10). mult = 2 - 1 = 1.
    // 1, 0, brown. 
    // Wait. 10 * 10^1 = 100. Correct.

    // Ex: 4700. 4 band.
    // mag 3. norm 4.7.
    // need 2 digits -> 47. (val 47). mult = 3 - 1 = 2.
    // 4 (yellow), 7 (violet), 10^2 (red). Correct.

    if (multColor) {
        colors.push(multColor.color);
    } else {
        // Fallback or error?
        // simple fallback for MVP
        colors.push("black");
    }

    // Tolerance (Gold default for 4 band, Brown for 5 band)
    colors.push(bands === 4 ? "gold" : "brown");

    return colors;
}
