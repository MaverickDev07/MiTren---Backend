import { BilleteroRepository } from '../repositories/CashRepository'
import { MonederoRepository } from '../repositories/MonederoRepository'
import { calculateChangeCommands } from '../utils/serial/ChangeCalculator'

export class PaymentDevicesResource {
  private billetero = new BilleteroRepository()
  private monedero = new MonederoRepository()

  constructor(monederoPort, monederoParser) {
    this.monederoPort = monederoPort // Puerto del monedero
    this.monederoParser = monederoParser // Parser del monedero
  }

  checkCoinTubes(targetAmount) {
    console.log('Consultando el estado de los tubos del monedero...')
    sendCommand(this.monederoPort, COMMANDS.TubeStatus)

    this.monederoParser.once('data', data => {
      const response = data.toString('hex').toUpperCase()
      console.log(`Respuesta recibida: ${response}`)

      const { tubeStatus, total } = parseTubeStatus(response)
      console.log('Estado de los tubos:')
      Object.entries(tubeStatus)
        .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])) // Ordenar por denominación
        .forEach(([denomination, count]) => console.log(` - ${denomination}Bs: ${count} monedas`))

      console.log(`Total en Bs: ${total.toFixed(2)}Bs`)

      if (total >= 4.9) {
        console.log('Suficiente efectivo en tubos. Habilitando dispositivos para el pago...')
        this.determineBillAcceptance(targetAmount) // Configurar billetes aceptados
        console.log('----------------------------------------------------------------------')
        this.enableDevices() // Continuar con el flujo normal
      } else {
        console.log('No hay suficiente efectivo en los tubos. Operación cancelada.')
      }
    })
  }

  determineBillAcceptance(targetAmount) {
    // Define los billetes permitidos según el monto objetivo
    const billDenominations = [10, 20, 50, 100] // Denominaciones comunes de billetes
    const acceptedBills = billDenominations.filter(bill => bill <= targetAmount)

    // Simulación de configuración del dispositivo
    console.log('Determinando aceptación de billetes...')
    console.log(`Monto objetivo: ${targetAmount}Bs`)
    console.log('Billetes aceptados: ', acceptedBills)

    // Aquí podrías enviar un comando al dispositivo para configurar la aceptación
    sendCommand(this.monederoPort, COMMANDS.SetAcceptedBills, acceptedBills)

    return acceptedBills // Devuelve los billetes aceptados como referencia
  }

  enableDevices(targetAmount: number) {
    console.log('Habilitando dispositivos para el pago...')
    const changeCommands = calculateChangeCommands(targetAmount)

    changeCommands.forEach((command: any) => {
      this.monedero.sendCommand(command)
    })
  }

  checkTubeStatus() {
    console.log('Consultando el estado de los tubos del monedero...')
    this.monedero.sendCommand([0x02, 0x00, 0x0a, 0x10, 0x03])
    this.monedero.listen(data => {
      const response = data.toString('hex').toUpperCase()
      console.log(`Respuesta de tubos: ${response}`)
      // Lógica adicional para procesar la respuesta
    })
  }
}
