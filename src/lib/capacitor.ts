export type CapacitorUnit = "pF" | "nF" | "uF";

export interface CapacitorResult {
    value: number;
    unit: CapacitorUnit;
    fullString: string; // e.g., "0.1µF / 100nF"
    code: string;
}

export function decodeCapacitorCode(code: string): CapacitorResult | null {
    // Basic validation: 3 digits
    if (!/^\d{3}$/.test(code)) return null;

    const digits = parseInt(code.substring(0, 2), 10);
    const multiplier = parseInt(code.substring(2, 3), 10);

    // Value in pico-farads
    const valuePf = digits * Math.pow(10, multiplier);

    // Formatting Logic
    let displayValue = valuePf;
    let unit: CapacitorUnit = "pF";
    let altValue = "";

    if (valuePf >= 1000000) {
        unit = "uF";
        displayValue = valuePf / 1000000;
        // Add nF alt
        altValue = ` / ${(valuePf / 1000).toLocaleString()}nF`;
    } else if (valuePf >= 1000) {
        unit = "nF";
        displayValue = valuePf / 1000;
        // Add uF alt if large enough
        if (valuePf >= 10000) {
            altValue = ` / ${(valuePf / 1000000).toFixed(valuePf % 1000000 === 0 ? 0 : 2)}µF`;
        }
    }

    return {
        value: displayValue,
        unit,
        fullString: `${displayValue}${unit === "uF" ? "µF" : unit}${altValue}`,
        code
    };
}
