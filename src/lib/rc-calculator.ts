export interface RCResult {
    timeConstant: number;
    cutoffFrequency: number;
}

export function calculateRC(resistance: number, capacitance: number): RCResult {
    if (resistance <= 0 || capacitance <= 0) {
        return { timeConstant: 0, cutoffFrequency: 0 };
    }

    const timeConstant = resistance * capacitance;
    const cutoffFrequency = 1 / (2 * Math.PI * timeConstant);

    return { timeConstant, cutoffFrequency };
}

export function formatTime(seconds: number): string {
    if (seconds === 0) return "0s";
    if (seconds >= 1) return `${seconds.toFixed(2)}s`;
    if (seconds >= 1e-3) return `${(seconds * 1e3).toFixed(2)}ms`;
    if (seconds >= 1e-6) return `${(seconds * 1e6).toFixed(2)}µs`;
    if (seconds >= 1e-9) return `${(seconds * 1e9).toFixed(2)}ns`;
    return `${(seconds * 1e12).toFixed(2)}ps`;
}

export function formatFrequency(hz: number): string {
    if (hz === 0) return "0Hz";
    if (hz >= 1e9) return `${(hz / 1e9).toFixed(2)}GHz`;
    if (hz >= 1e6) return `${(hz / 1e6).toFixed(2)}MHz`;
    if (hz >= 1e3) return `${(hz / 1e3).toFixed(2)}kHz`;
    return `${hz.toFixed(2)}Hz`;
}
