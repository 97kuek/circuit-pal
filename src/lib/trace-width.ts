export interface TraceCalculation {
    widthInMils: number;
    widthInMm: number;
    areaSqMils: number;
    resistance: number; // Ohms
    voltageDrop: number; // Volts
    powerLoss: number; // Watts
}

// IPC-2221 Formulas
// Area (mils^2) = (Current [Amps] / (k * (Temp_Rise_C ^ b))) ^ (1/c)
// Width (mils) = Area / (Thickness [oz] * 1.378)
// k, b, c are constants depending on layer (Internal vs External)

const K_INNER = 0.024;
const K_OUTER = 0.048;
const B = 0.44;
const C = 0.725;

export function calculateTraceWidth(
    current: number, // Amps
    tempRise: number, // Celsius
    thicknessOz: number, // oz/ft^2 (usually 1 or 2)
    isInternal: boolean = false,
    lengthMm: number = 10, // For resistance calc
    ambientTemp: number = 25 // For curiosity, usually doesn't affect IPC-2221 width calc directly in basic form
): TraceCalculation {

    // 1. Calculate Required Area
    const k = isInternal ? K_INNER : K_OUTER;
    const requiredAreaMilsRuled = Math.pow(current / (k * Math.pow(tempRise, B)), 1 / C);

    // 2. Calculate Width
    // Thickness in mils = thicknessOz * 1.378
    const thicknessMils = thicknessOz * 1.378;
    const widthMils = requiredAreaMilsRuled / thicknessMils;

    // 3. Convert to mm
    // 1 mil = 0.0254 mm
    const widthMm = widthMils * 0.0254;

    // 4. Calculate Resistance
    // R = (rho * L) / A
    // Copper Resisitivity (rho) approx 1.68e-8 Ohm*m at 20C
    // Let's use standard formula: R = (0.000017 * L_mm) / (W_mm * T_mm) * (1 + 0.0039 * (Temp - 25))
    // T_mm = thicknessOz * 0.035
    const thicknessMm = thicknessOz * 0.035;
    const operatingTemp = ambientTemp + tempRise;
    // Temperature coefficient adjustment
    const resistivity = 0.0000172 * (1 + 0.00393 * (operatingTemp - 25));

    const areaMm2 = widthMm * thicknessMm;
    const resistance = (resistivity * lengthMm) / areaMm2;

    // 5. Voltage Drop
    const voltageDrop = current * resistance;

    // 6. Power Loss
    const powerLoss = current * current * resistance;

    return {
        widthInMils: widthMils,
        widthInMm: widthMm,
        areaSqMils: requiredAreaMilsRuled,
        resistance,
        voltageDrop,
        powerLoss
    };
}
