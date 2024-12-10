import { createParser, createSerialPort } from '../utils/serial/SerialPortUtils'

export class MonederoRepository {
  private port = createSerialPort('/dev/ttyS2', 115200, 'none')
  private parser = createParser(this.port, 24)

  sendCommand(command: number[]) {
    this.port.write(Buffer.from(command))
  }

  listen(callback: (data: Buffer) => void) {
    this.parser.on('data', callback)
  }
}
