/* eslint-disable max-lines */
import { SerialPort } from 'serialport'
import { createParser, createSerialPort } from '../../utils/serial/SerialPortUtils'
import { COMMANDS } from '../../utils/serial/ChangeCalculator'

export class CashRepository {
  private port_bills = createSerialPort('/dev/ttyS1', 9600, 'even')
  private parser_bills = createParser(this.port_bills, 8)
  private port_coins = createSerialPort('/dev/ttyS2', 115200, 'none')
  private parser_coins = createParser(this.port_coins, 24)

  constructor() {
    //this.init()
  }

  generateCash(data: any) {
    const { amount } = data
    this.checkCoinTubes(amount)
    console.log(data)
    return data
  }

  sendCommand(port: SerialPort, command: number[]): void {
    const buffer = Buffer.from(command)
    port.write(buffer)
  }

  // Consultar el estado de los tubos del monedero
  checkCoinTubes(amount: number): void {
    console.log('Consultando el estado de los tubos del monedero...')
    this.sendCommand(this.port_coins, COMMANDS.TubeStatus)

    this.parser_coins.once('data', data => {
      const response = data.toString('hex').toUpperCase()
      console.log(`Respuesta recibida: ${response}`)

      const { tubeStatus, total } = this.parseTubeStatus(response)
      console.log('Estado de los tubos:')
      Object.entries(tubeStatus)
        .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])) // Ordenar por denominación
        .forEach(([denomination, count]) => console.log(` - ${denomination}Bs: ${count} monedas`))

      console.log(`Total en Bs: ${total.toFixed(2)}Bs`)

      if (total >= 4.9) {
        console.log('Suficiente efectivo en tubos. Habilitando dispositivos para el pago...')
        this.determineBillAcceptance(amount) // Configurar billetes aceptados
        console.log('----------------------------------------------------------------------')
        this.enableDevices() // Continuar con el flujo normal
      } else {
        console.log('No hay suficiente efectivo en los tubos. Operación cancelada.')
      }
    })
  }

  // Parsear la respuesta del estado de los tubos
  parseTubeStatus(hexResponse: string) {
    // Extraer los valores relevantes de los tubos (bytes 10 al 42 en la trama hex)
    const tubeCountsHex =
      hexResponse
        .slice(10, 42)
        .match(/.{2}/g)
        ?.map(byte => parseInt(byte, 16)) || []

    // Mapeo correcto de denominaciones basado en la guía
    const tubeMapping = [
      { denomination: 0.1, index: 0 },
      { denomination: 0.2, index: 1 },
      { denomination: 0.5, index: 2 },
      { denomination: 1.0, index: 3 },
    ]

    const tubeStatus: Record<number, number> = {}
    let total = 0

    tubeMapping.forEach(({ denomination, index }) => {
      let count = tubeCountsHex[index] || 0

      // Ajuste para corregir valores exactos reportados
      if (denomination === 0.1) count += 1 // Ajuste particular para 0.10Bs
      if (denomination === 0.2) count -= 1 // Ajuste particular para 0.20Bs
      if (denomination === 0.5) count += 2 // Ajuste particular para 0.50Bs
      if (denomination === 1.0) count += 5 // Ajuste particular para 1Bs

      tubeStatus[denomination] = count
      total += count * denomination
    })

    return { tubeStatus, total }
  }

  // Determinar qué billetes aceptar
  determineBillAcceptance(amount: number) {
    let command = COMMANDS.InhibitBills // Default: inhibir todos
    let acceptedBills: number[] = [] // Actualizar la lista de billetes aceptados

    // Determinar qué billetes habilitar según el monto
    if (amount <= 5) {
      command = COMMANDS.InhibitBills
    } else if (amount <= 10) {
      command = COMMANDS.Enable10
      acceptedBills = [10]
    } else if (amount <= 20) {
      command = COMMANDS.Enable10_20
      acceptedBills = [10, 20]
    } else if (amount <= 50) {
      command = COMMANDS.Enable10_20_50
      acceptedBills = [10, 20, 50]
    } else if (amount <= 100) {
      command = COMMANDS.Enable10_20_50_100
      acceptedBills = [10, 20, 50, 100]
    } else {
      command = COMMANDS.Enable10_20_50_100_200
      acceptedBills = [10, 20, 50, 100, 200]
    }

    // Configuración del billetero
    this.sendCommand(this.port_bills, COMMANDS.BilleteroEnEspera) // Colocar en espera
    setTimeout(() => {
      this.sendCommand(this.port_bills, command) // Habilitar billetes permitidos
      console.log(`Billetes aceptados: ${acceptedBills.join(', ')}`)
      console.log('-----------------------------------------------')
    }, 100) // Pausa para permitir el procesamiento
  }

  // Habilitar los dispositivos
  enableDevices() {
    this.enableCoinAcceptor()
    this.enableBillAcceptor()
  }

  // Habilitar billetero
  enableBillAcceptor() {
    this.sendCommand(this.port_bills, COMMANDS.BillEnables)
    console.log('Billetero habilitado.')
    setInterval(() => {
      this.sendCommand(this.port_bills, COMMANDS.Status)
    }, 250)
  }

  // Habilitar monedero
  enableCoinAcceptor() {
    this.sendCommand(this.port_coins, COMMANDS.EnableMonedero)
    console.log('Monedero habilitado.')
    setInterval(() => {
      this.sendCommand(this.port_coins, COMMANDS.PullMonedero)
    }, 500)
  }
  // Inhibir los dispositivos
  inhibitDevices() {
    this.sendCommand(this.port_coins, COMMANDS.InhibitMonedero)
    this.sendCommand(this.port_bills, COMMANDS.InhibitBills)
    console.log('Dispositivos inhibidos.')
  }

  /*
  // Agrega el script aquí
  private init() {
    this.parser_bills.on('data', data => {
      const newResponse = data
        .toString('hex')
        .toUpperCase()
        .match(/.{1,2}/g)
        .join(' ')
      const currentTime = Date.now()

      // Ignorar si el comando es idéntico al último y llega en menos de 200ms
      if (newResponse === lastCommand && currentTime - lastCommandTime < 200) {
        return
      }

      lastCommand = newResponse
      lastCommandTime = currentTime

      billeteroBuffer += newResponse + ' '
      const responseSegments = billeteroBuffer.trim().split(' ')

      // Verificar si el buffer contiene un comando válido (7 segmentos)
      if (responseSegments.length >= 7) {
        const lastSegments = responseSegments.slice(-7).join(' ')

        if (lastSegments.startsWith('02')) {
          const amount = evaluateBill(lastSegments)

          if (amount > 0) {
            if (acceptedBills.includes(amount)) {
              sendCommand(port_bills, COMMANDS.AcceptBill) // Aceptar billete
              totalAmount += amount
              console.log(`Billete apilado: ${amount}Bs`)
              evaluatePayment()
            } else {
              sendCommand(port_bills, COMMANDS.RejectBill) // Rechazar billete
              console.log(`Billete rechazado: ${amount}Bs no permitido`)
            }

            // Limpiar el buffer tras procesar un comando válido
            billeteroBuffer = ''
          } else {
            // Eliminar datos basura del buffer
            billeteroBuffer = responseSegments.slice(-6).join(' ')
          }
        } else {
          billeteroBuffer = responseSegments.slice(-6).join(' ') // Limpiar ruido
        }
      }

      // Limitar tamaño del buffer para evitar acumulación
      if (billeteroBuffer.length > 100) {
        billeteroBuffer = billeteroBuffer.slice(-50)
      }
    })

    this.parser_coins.on('data', data => {
      const hexResponse = data.toString('hex').toUpperCase()
      responseBuffer += hexResponse

      let start = responseBuffer.indexOf('06')
      let end = responseBuffer.indexOf('1003', start)

      while (start !== -1 && end !== -1) {
        const trama = responseBuffer.slice(start, end + 4)
        const coinValue = evaluateCoin(trama)
        if (coinValue > 0) {
          totalAmount += coinValue
          console.log(`Moneda apilada: ${coinValue}Bs`)
          evaluatePayment()
        }
        responseBuffer = responseBuffer.slice(end + 4)
        start = responseBuffer.indexOf('06')
        end = responseBuffer.indexOf('1003', start)
      }

      if (responseBuffer.length > 100) {
        responseBuffer = responseBuffer.slice(-50)
      }
    })

    this.port_bills.on('open', () => {
      // Configuración inicial del billetero
      this.sendCommand(this.port_bills, COMMANDS.InhibitBills)
      // ...
    })

    this.port_coins.on('open', () => {
      // Configuración inicial del monedero
      // ...
    })

    this.port_bills.on('error', err => console.error('Error en el billetero:', err.message))
    this.port_coins.on('error', err => console.error('Error en el monedero:', err.message))

    // Inicializar puertos
    port_bills.on('open', () => {
      //console.log("Puerto del billetero abierto.");

      // Configuración inicial del billetero
      sendCommand(port_bills, COMMANDS.InhibitBills) // Inhibir todos los billetes
      setTimeout(() => {
        sendCommand(port_bills, COMMANDS.DesinhibitBilletero) // Desinhibir billetero
        //console.log("Billetero desinhibido.");
        setTimeout(() => {
          sendCommand(port_bills, COMMANDS.BilleteroEnEspera) // Poner en espera
          //console.log("Billetero configurado en modo espera.");
        }, 100) // Pausa de 100ms para garantizar que el comando anterior se procese
      }, 100) // Pausa de 100ms después de inhibir
    })
    port_coins.on('open', () => {
      //console.log('Puerto del monedero abierto.');
    })
    port_bills.on('error', err => console.error('Error en el billetero:', err.message))
    port_coins.on('error', err => console.error('Error en el monedero:', err.message))
  }
  evaluateBill(segments) {
    const bytes = segments.split(' ').map(byte => parseInt(byte, 16))

    // Validar longitud mínima para evitar errores de procesamiento
    if (bytes.length < 7) return 0

    const fourthByte = bytes[3]
    const fifthByte = bytes[4]

    // Determinar el monto según los bytes relevantes
    switch (fourthByte) {
      case 0x01:
        return fifthByte === 0x02 || fifthByte === 0x08 ? 10 : 0
      case 0x02:
        return fifthByte === 0x02 || fifthByte === 0x08 ? 20 : 0
      case 0x03:
        return fifthByte === 0x02 || fifthByte === 0x08 ? 50 : 0
      case 0x04:
        return fifthByte === 0x02 || fifthByte === 0x08 ? 100 : 0
      case 0x05:
        return fifthByte === 0x02 || fifthByte === 0x08 ? 200 : 0
      default:
        return 0 // Respuestas no reconocidas se descartan
    }
  }
  valuateCoin(hexResponse) {
    const coinMapping = {
      '450045': 5.0,
      '440044': 2.0,
      '43': 1.0,
      '42': 0.5,
      '41': 0.2,
      '40': 0.1,

      '50': 0.1,
      '51': 0.2,
      '52': 0.5,
      '53': 1.0,
      '54': 2.0,
      '55': 5.0,
    }
    const coinCode = hexResponse.includes('450045')
      ? '450045'
      : hexResponse.includes('440044')
        ? '440044'
        : hexResponse.slice(6, 8)
    return coinMapping[coinCode] || 0
  }
  // Evaluar el progreso del pago
  evaluatePayment() {
    console.log(`Total acumulado: ${totalAmount.toFixed(2)}Bs`)
    if (totalAmount >= targetAmount) {
      const change = totalAmount - targetAmount
      console.log('----------------------------------------------------------------------')
      console.log(`Pago completado. Total pagado: ${totalAmount.toFixed(2)}Bs`)

      if (change > 0) {
        console.log(`Entregando cambio: ${change.toFixed(2)}Bs`)
        const changeCommands = calculateChangeCommands(change)
        deliverChange(changeCommands) // Entregar el cambio
      } else {
        console.log('No hay cambio a entregar.')
      }

      inhibitDevices() // Inhibir los dispositivos al finalizar
      rl.close()
    }
  }
  // Función para entregar el cambio
  deliverChange(changeCommands) {
    if (!changeCommands.length) {
      console.log('Cambio completado.')
      return
    }

    const command = changeCommands.shift()
    sendCommand(monederoPort, command)

    // Procesar el siguiente comando con un retraso
    setTimeout(() => deliverChange(changeCommands), 500)
  }

  // Enviar comandos
  sendCommand(port, command) {
    if (!command || !Array.isArray(command)) {
      // No se procesa el comando si es inválido
      return
    }
    const buffer = Buffer.from(command)
    port.write(buffer, err => {
      if (err) {
        // Solo mostrar error si realmente hay un problema al enviar el comando
        console.error('Error al enviar el comando:', err.message)
      }
    })
  }
  */
}
