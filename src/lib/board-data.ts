export type PinFunction = "power" | "gnd" | "digital" | "analog" | "pwm" | "i2c" | "spi" | "uart" | "none";

export interface PinData {
    pin: number | string; // Physical pin number or logical name
    name: string;      // Display name (e.g., "D13", "A0")
    side: "left" | "right";
    functions: PinFunction[];
    description?: string;
}

export interface BoardData {
    id: string;
    name: string;
    mcu: string;
    pins: PinData[];
}

export const ARDUINO_UNO: BoardData = {
    id: "arduino-uno",
    name: "Arduino Uno",
    mcu: "ATmega328P",
    pins: [
        // Left Side (Reset to A5)
        { pin: "reset", name: "RESET", side: "left", functions: ["none"] },
        { pin: "3v3", name: "3.3V", side: "left", functions: ["power"] },
        { pin: "5v", name: "5V", side: "left", functions: ["power"] },
        { pin: "gnd", name: "GND", side: "left", functions: ["gnd"] },
        { pin: "gnd", name: "GND", side: "left", functions: ["gnd"] },
        { pin: "vin", name: "Vin", side: "left", functions: ["power"] },
        { pin: "a0", name: "A0", side: "left", functions: ["analog", "digital"] },
        { pin: "a1", name: "A1", side: "left", functions: ["analog", "digital"] },
        { pin: "a2", name: "A2", side: "left", functions: ["analog", "digital"] },
        { pin: "a3", name: "A3", side: "left", functions: ["analog", "digital"] },
        { pin: "a4", name: "A4", side: "left", functions: ["analog", "digital", "i2c"], description: "SDA" },
        { pin: "a5", name: "A5", side: "left", functions: ["analog", "digital", "i2c"], description: "SCL" },

        // Right Side (D0 to AREF)
        { pin: "scl", name: "SCL", side: "right", functions: ["i2c"] },
        { pin: "sda", name: "SDA", side: "right", functions: ["i2c"] },
        { pin: "aref", name: "AREF", side: "right", functions: ["none"] },
        { pin: "gnd", name: "GND", side: "right", functions: ["gnd"] },
        { pin: "13", name: "D13", side: "right", functions: ["digital", "spi"], description: "SCK / LED" },
        { pin: "12", name: "D12", side: "right", functions: ["digital", "spi"], description: "MISO" },
        { pin: "11", name: "D11", side: "right", functions: ["digital", "pwm", "spi"], description: "MOSI" },
        { pin: "10", name: "D10", side: "right", functions: ["digital", "pwm", "spi"], description: "CS" },
        { pin: "9", name: "D9", side: "right", functions: ["digital", "pwm"] },
        { pin: "8", name: "D8", side: "right", functions: ["digital"] },
        { pin: "7", name: "D7", side: "right", functions: ["digital"] },
        { pin: "6", name: "D6", side: "right", functions: ["digital", "pwm"] },
        { pin: "5", name: "D5", side: "right", functions: ["digital", "pwm"] },
        { pin: "4", name: "D4", side: "right", functions: ["digital"] },
        { pin: "3", name: "D3", side: "right", functions: ["digital", "pwm"], description: "INT1" },
        { pin: "2", name: "D2", side: "right", functions: ["digital"], description: "INT0" },
        { pin: "1", name: "D1", side: "right", functions: ["digital", "uart"], description: "TX" },
        { pin: "0", name: "D0", side: "right", functions: ["digital", "uart"], description: "RX" },
    ]
};

// ESP32 DevKit V1 (30 Pin Version)
// Reference: Standard 30-pin layout
export const ESP32_DEVKIT_V1: BoardData = {
    id: "esp32",
    name: "ESP32 DevKit V1",
    mcu: "ESP32-WROOM-32",
    pins: [
        // LEFT SIDE (Top to Bottom: EN to D13)
        { pin: "en", name: "EN", side: "left", functions: ["none"], description: "Reset" },
        { pin: "vp", name: "VP", side: "left", functions: ["analog", "digital"], description: "GPI36/ADC1_0" },
        { pin: "vn", name: "VN", side: "left", functions: ["analog", "digital"], description: "GPI39/ADC1_3" },
        { pin: "34", name: "D34", side: "left", functions: ["analog", "digital"], description: "GPI34/ADC1_6" },
        { pin: "35", name: "D35", side: "left", functions: ["analog", "digital"], description: "GPI35/ADC1_7" },
        { pin: "32", name: "D32", side: "left", functions: ["analog", "digital", "pwm"], description: "Touch9/ADC1_4" },
        { pin: "33", name: "D33", side: "left", functions: ["analog", "digital", "pwm"], description: "Touch8/ADC1_5" },
        { pin: "25", name: "D25", side: "left", functions: ["analog", "digital", "pwm"], description: "DAC1/ADC2_8" },
        { pin: "26", name: "D26", side: "left", functions: ["analog", "digital", "pwm"], description: "DAC2/ADC2_9" },
        { pin: "27", name: "D27", side: "left", functions: ["analog", "digital", "pwm"], description: "Touch7/ADC2_7" },
        { pin: "14", name: "D14", side: "left", functions: ["analog", "digital", "pwm", "spi"], description: "HSPI_CLK/ADC2_6" },
        { pin: "12", name: "D12", side: "left", functions: ["analog", "digital", "pwm", "spi"], description: "HSPI_MISO/ADC2_5" },
        { pin: "gnd", name: "GND", side: "left", functions: ["gnd"] },
        { pin: "13", name: "D13", side: "left", functions: ["analog", "digital", "pwm", "spi"], description: "HSPI_MOSI/ADC2_4" },

        // RIGHT SIDE (Top to Bottom: Vin to D23) -> Actually typical boards go VIN top right to D23 bottom right
        { pin: "vin", name: "VIN", side: "right", functions: ["power"], description: "5V Input" },
        { pin: "gnd", name: "GND", side: "right", functions: ["gnd"] },
        { pin: "15", name: "D15", side: "right", functions: ["digital", "pwm", "spi", "analog"], description: "HSPI_CS/ADC2_3" },
        { pin: "2", name: "D2", side: "right", functions: ["digital", "pwm", "analog"], description: "LED/ADC2_2" },
        { pin: "4", name: "D4", side: "right", functions: ["digital", "pwm", "analog"], description: "ADC2_0" },
        { pin: "16", name: "RX2", side: "right", functions: ["digital", "uart"], description: "GPIO16" },
        { pin: "17", name: "TX2", side: "right", functions: ["digital", "uart"], description: "GPIO17" },
        { pin: "5", name: "D5", side: "right", functions: ["digital", "pwm", "spi"], description: "VSPI_CS" },
        { pin: "18", name: "D18", side: "right", functions: ["digital", "pwm", "spi"], description: "VSPI_CLK" },
        { pin: "19", name: "D19", side: "right", functions: ["digital", "pwm", "spi"], description: "VSPI_MISO" },
        { pin: "21", name: "D21", side: "right", functions: ["digital", "i2c"], description: "SDA" },
        { pin: "3", name: "RX0", side: "right", functions: ["digital", "uart"], description: "RX0" },
        { pin: "1", name: "TX0", side: "right", functions: ["digital", "uart"], description: "TX0" },
        { pin: "22", name: "D22", side: "right", functions: ["digital", "i2c"], description: "SCL" },
        { pin: "23", name: "D23", side: "right", functions: ["digital", "pwm", "spi"], description: "VSPI_MOSI" },
    ]
};
