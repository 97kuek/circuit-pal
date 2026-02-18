import { useState, useEffect, useRef, useCallback } from 'react';

export interface SerialMessage {
    id: string;
    timestamp: number;
    text: string;
    direction: 'rx' | 'tx';
}

export function useSerial() {
    const [isSupported, setIsSupported] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [reader, setReader] = useState<ReadableStreamDefaultReader<string> | null>(null);
    const [writer, setWriter] = useState<WritableStreamDefaultWriter<string> | null>(null);
    const [port, setPort] = useState<SerialPort | null>(null);
    const [messages, setMessages] = useState<SerialMessage[]>([]);
    const [baudRate, setBaudRate] = useState(9600);

    const encoder = useRef(new TextEncoder());
    const decoder = useRef(new TextDecoder());

    useEffect(() => {
        setIsSupported('serial' in navigator);
    }, []);

    const clearMessages = () => setMessages([]);

    const connect = async () => {
        try {
            if (!isSupported) return;

            const selectedPort = await navigator.serial.requestPort();
            await selectedPort.open({ baudRate });

            const textEncoder = new TextEncoderStream();
            const textDecoder = new TextDecoderStream();

            const readableStreamClosed = (selectedPort.readable as ReadableStream).pipeTo(textDecoder.writable);
            const writableStreamClosed = textEncoder.readable.pipeTo(selectedPort.writable as WritableStream);

            const reader = textDecoder.readable.getReader();
            const writer = textEncoder.writable.getWriter();

            setPort(selectedPort);
            setReader(reader);
            setWriter(writer);
            setIsConnected(true);

            readLoop(reader);
        } catch (err) {
            console.error('Error connecting:', err);
            // alert('Connection failed or cancelled.');
        }
    };

    const disconnect = async () => {
        if (reader) {
            await reader.cancel();
            setReader(null);
        }
        if (writer) {
            await writer.close();
            setWriter(null);
        }
        if (port) {
            await port.close();
            setPort(null);
        }
        setIsConnected(false);
    };

    const readLoop = async (reader: ReadableStreamDefaultReader<string>) => {
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                if (value) {
                    addMessage(value, 'rx');
                }
            }
        } catch (err) {
            console.error('Read error:', err);
        } finally {
            reader.releaseLock();
        }
    };

    const send = async (text: string) => {
        if (!writer) return;
        try {
            await writer.write(text + '\n'); // Auto-append newline
            addMessage(text, 'tx');
        } catch (err) {
            console.error('Write error:', err);
        }
    };

    const addMessage = (text: string, direction: 'rx' | 'tx') => {
        setMessages(prev => {
            // Attempt to append to last message if it's the same direction and not a newline break
            // But simpler is just to add new chunks. However, serial often sends chars.
            // For now, let's just append raw chunks.
            // Better logic: Split by newlines and handle lines.
            return [...prev, { id: crypto.randomUUID(), timestamp: Date.now(), text, direction }];
        });
    };

    const setBaud = (rate: number) => {
        if (isConnected) {
            // Changing baud rate usually requires closing and opening.
            // For simplicity, we just set the state for next connection.
            setBaudRate(rate);
        } else {
            setBaudRate(rate);
        }
    };

    return { isSupported, isConnected, connect, disconnect, send, messages, clearMessages, baudRate, setBaud };
}
