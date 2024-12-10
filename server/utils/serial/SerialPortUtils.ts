import { SerialPort } from 'serialport'
import { ByteLengthParser } from '@serialport/parser-byte-length'

export function createSerialPort(path: string, baudRate: number, parity: string) {
  return new SerialPort({
    path,
    baudRate,
    dataBits: 8,
    parity,
    stopBits: 1,
    flowControl: false,
  })
}

export function createParser(port: SerialPort, length: number) {
  return port.pipe(new ByteLengthParser({ length }))
}
