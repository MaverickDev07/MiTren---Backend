import { createParser, createSerialPort } from '../utils/serial/SerialPortUtils'

export class BilleteroRepository {
  private port = createSerialPort('/dev/ttyS1', 9600, 'even')
  private parser = createParser(this.port, 8)

  sendCommand(command: number[]) {
    this.port.write(Buffer.from(command))
  }

  listen(callback: (data: Buffer) => void) {
    this.parser.on('data', callback)
  }
}
