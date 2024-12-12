/* eslint-disable max-lines */
import { NextFunction, Request, Response } from 'express'
import { exec } from 'child_process'
import path from 'path'

import StationPairPricesRepository from '../../../repositories/ticket_flow/StationPairPricesRepository'
import StationPairPricesResource from '../../../resources/ticket_flow/StationPairPricesResource'
import LineRepository from '../../../repositories/LineRepository'
import LineResource from '../../../resources/LineResource'
import RouteRepository from '../../../repositories/RouteRepository'
import ApiError from '../../../errors/ApiError'
import StationResource from '../../../resources/StationResource'
import KioskRepository from '../../../repositories/KioskRepository'
import KioskResource from '../../../resources/KioskResource'
import EnvManager from '../../../config/EnvManager'
import MethodRepository from '../../../repositories/MethodRepository'
import MethodResource from '../../../resources/MethodResource'
import VeripagosService from '../../../utils/VeripagosService'
import TicketRepository from '../../../repositories/TicketRepository'
import TicketResource from '../../../resources/TicketResource'
import { createPdfBinary } from '../../../utils/LibPdf'
import { ticketDocument } from './generatePDF'
import { CashRepository } from '../../../repositories/ticket_flow/CashRepository'
import { DeviceSerial } from '../../../utils/serial/DeviceSerial'

const veripagosService = new VeripagosService(
  'https://veripagos.com/api',
  EnvManager.getCredentialQR(),
)

export const listLinesByActive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new LineRepository()
    const lines = LineResource.collection(await repository.getAllByActive())
    res.status(200).json({ lines })
  } catch (error: any) {
    next(error)
  }
}

export const listPagedStationsByLine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new RouteRepository()

    // Convertir los parámetros de query a número usando Number() y proporcionar valores predeterminados
    const limit = req.query.limit ? Number(req.query.limit) : 4
    const page = req.query.page ? Number(req.query.page) : 1

    // Verificar si la conversión fue exitosa
    if (isNaN(limit) || isNaN(page)) {
      throw new ApiError({
        name: 'INVALID_DATA_ERROR',
        message: 'Los parámetros de paginación deben ser números enteros',
        status: 422,
        code: 'ERR_INV',
      })
    }

    const routePaged = StationResource.paged(
      await repository.getPagedStationsByLine({
        id: req.params.id,
        limit,
        page,
      }),
    )

    res.status(200).json({ routePaged })
  } catch (error) {
    next(error)
  }
}

export const getStationByKioskId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new KioskRepository()
    const kioskResource = new KioskResource(await repository.getStationByKioskId(req.params.id))
    res.status(200).json({ kiosk: kioskResource.itemPopulate() })
  } catch (error: any) {
    next(error)
  }
}

export const listPricesByStationPair = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { start_station_id, end_station_id } = req.params
    const repository = new StationPairPricesRepository()
    const priceResource = new StationPairPricesResource(
      await repository.getPricesByStationPair(start_station_id as string, end_station_id as string),
    )
    res.status(200).json(priceResource.getPrices())
  } catch (error: any) {
    next(error)
  }
}

export const listMethodsByActivate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new MethodRepository()
    const methods = MethodResource.collection(await repository.getAllByActive())
    res.status(200).json({ methods })
  } catch (error: any) {
    next(error)
  }
}

export const generateQR = async (req: Request, res: Response, next: NextFunction) => {
  const { body: data } = req

  try {
    const response = await veripagosService.generateQr({
      secret_key: EnvManager.getQrKey(),
      ...data,
    })

    res.status(200).json(response)
  } catch (error: any) {
    next(error)
  }
}

export const verifyQrStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { body: data } = req

  try {
    const response = await veripagosService.verifyQrStatus({
      secret_key: EnvManager.getQrKey(),
      ...data,
    })

    const status = response.Data ? 200 : 500

    res.status(status).send(response)
  } catch (error) {
    next(error)
  }
}

export const generateCash = async (req: Request, res: Response, next: NextFunction) => {
  // const { body: data } = req

  try {
    // const repository = new CashRepository()
    // const response = await repository.generateCash(data)

    /*const amount = data.amount
    const deviceSerial = new DeviceSerial()
    deviceSerial.startTransaction(amount)*/

    const { amount } = req.body

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Monto inválido. Debe ser un número positivo.' })
    }

    // Construir la ruta al script
    const scriptPath = path.join(__dirname, '../../../../scripts/script.js')

    // Ejecutar el script con el monto como argumento
    exec(`node ${scriptPath} ${amount}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar el script: ${error.message}`)
        return res.status(500).json({ error: 'Error al ejecutar el script.' })
      }
      if (stderr) {
        console.error(`Error en el script: ${stderr}`)
        return res.status(500).json({ error: 'Error en el script.' })
      }

      console.log(`Salida del script: ${stdout}`)
      res.status(200).json({ message: 'Operación ejecutada con éxito.', output: stdout })
    })
  } catch (error: any) {
    next(error)
  }
}

export const inhibitDevices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new CashRepository()
    repository.inhibitDevices()

    res.status(200).json({ message: 'Dispositivos inhibidos' })
  } catch (error: any) {
    next(error)
  }
}

export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new TicketRepository()
    const ticketResource = new TicketResource(await repository.create(req.body))
    const ticket = ticketResource.item()
    const docDefinition = ticketDocument(ticket)

    createPdfBinary(docDefinition, function (binary) {
      res.contentType('application/pdf')
      res.setHeader('Content-Disposition', 'attachment; filename=ticket.pdf')
      res.send(Buffer.from(binary, 'base64'))
    })
  } catch (error) {
    next(error)
  }
}
