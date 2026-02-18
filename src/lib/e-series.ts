export type SeriesType = 'E12' | 'E24' | 'E96';

export const E12_VALUES = [
    1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2
];

export const E24_VALUES = [
    1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
    3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1
];

export const E96_VALUES = [
    1.00, 1.02, 1.05, 1.07, 1.10, 1.13, 1.15, 1.18, 1.21, 1.24, 1.27, 1.30,
    1.33, 1.37, 1.40, 1.43, 1.47, 1.50, 1.54, 1.58, 1.62, 1.65, 1.69, 1.74,
    1.78, 1.82, 1.87, 1.91, 1.96, 2.00, 2.05, 2.10, 2.15, 2.21, 2.26, 2.32,
    2.37, 2.43, 2.49, 2.55, 2.61, 2.67, 2.74, 2.80, 2.87, 2.94, 3.01, 3.09,
    3.16, 3.24, 3.32, 3.40, 3.48, 3.57, 3.65, 3.74, 3.83, 3.92, 4.02, 4.12,
    4.22, 4.32, 4.42, 4.53, 4.64, 4.75, 4.87, 4.99, 5.11, 5.23, 5.36, 5.49,
    5.62, 5.76, 5.90, 6.04, 6.19, 6.34, 6.49, 6.65, 6.81, 6.98, 7.15, 7.32,
    7.50, 7.68, 7.87, 8.06, 8.25, 8.45, 8.66, 8.87, 9.09, 9.31, 9.53, 9.76
];

export function getSeriesValues(type: SeriesType): number[] {
    switch (type) {
        case 'E12': return E12_VALUES;
        case 'E24': return E24_VALUES;
        case 'E96': return E96_VALUES;
    }
}

export function findNearest(value: number, type: SeriesType): { exact: boolean, value: number, diff: number } {
    if (value <= 0) return { exact: false, value: 0, diff: value };

    const series = getSeriesValues(type);

    // Calculate exponent (order of magnitude)
    const exponent = Math.floor(Math.log10(value));
    // Normalize value to 1.0 - 9.99... range
    // Note: E96 goes from 1.00 to 9.76, but essentially covers the decade
    const mantissa = value / Math.pow(10, exponent);

    let closestMantissa = series[0];
    let minDiff = Math.abs(mantissa - closestMantissa);

    for (const s of series) {
        const diff = Math.abs(mantissa - s);
        if (diff < minDiff) {
            minDiff = diff;
            closestMantissa = s;
        }
    }

    // Check if the input mantissa is basically equal to one of the series values
    // Using a small epsilon for float comparison
    const exact = minDiff < 0.000001;

    const resultValue = closestMantissa * Math.pow(10, exponent);

    return {
        exact,
        value: resultValue,
        diff: Math.abs(value - resultValue)
    };
}
