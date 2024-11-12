/* eslint-disable max-lines */
import { NextFunction, Request, Response } from 'express'
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
import Kiosk from '../../../database/models/Kiosk'

const veripagosService = new VeripagosService(
  'https://veripagos.com/api',
  EnvManager.getCredentialQR(),
)

// Middlewares
export const getKioskIdByEnv = (req: Request, res: Response, next: NextFunction) => {
  try {
    const kioskId = EnvManager.getKioskId()
    if (!kioskId)
      throw new ApiError({
        name: 'NOT_FOUND_ERROR',
        message: 'KioskId not found',
        status: 400,
        code: 'ERR_NF',
      })
    req.params.id = EnvManager.kioskId()

    next()
  } catch (error: any) {
    next(error)
  }
}
export const preloadVeripagosData = (req: Request, res: Response, next: NextFunction) => {
  try {
    const kioskId = EnvManager.getKioskId()
    const { body } = req
    if (!kioskId)
      throw new ApiError({
        name: 'NOT_FOUND_ERROR',
        message: 'KioskId not found',
        status: 404,
        code: 'ERR_NF',
      })
    const now = new Date()
    const day = now.getDate().toString().padStart(2, '0')
    const month = (now.getMonth() + 1).toString().padStart(2, '0') // Los meses van de 0 a 11, por eso se suma 1
    const year = now.getFullYear()

    const currentDate = `${day}-${month}-${year}`

    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')

    const currentTime = `${hours}:${minutes}:${seconds}`

    req.body = {
      ...req.body,
      data: [
        'kiosk_id',
        kioskId,
        'fecha',
        currentDate,
        'hora',
        currentTime,
        'desde',
        body.start_station,
        'hasta',
        body.end_station,
      ],
      vigencia: '0/00:15',
      uso_unico: true,
      detalle: `Pago ticket: hasta ${body.end_station}`,
    }

    next()
  } catch (error: any) {
    next(error)
  }
}
export const computeTotalPrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prices } = req.body
    const kioskId = EnvManager.getKioskId()
    if (!kioskId)
      throw new ApiError({
        name: 'NOT_FOUND_ERROR',
        message: 'KioskId not found',
        status: 400,
        code: 'ERR_NF',
      })
    const kiosk = await Kiosk.findById(kioskId)
    if (!kiosk)
      throw new ApiError({
        name: 'MODEL_NOT_FOUND_ERROR',
        message: 'Kiosk not found',
        status: 400,
        code: 'ERR_MNF',
      })
    const totalPrice = prices.reduce((acc: number, price: any) => {
      return acc + price.qty * price.base_price
    }, 0)

    req.body.kiosk_code = kiosk.kiosk_code
    req.body.total_price = totalPrice

    next()
  } catch (error) {
    next(error)
  }
}
export const validatePrices = (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalPrice = req.body.total_price
    console.log(totalPrice)

    next()
  } catch (error: any) {
    next(error)
  }
}
// End of middlewares

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
        status: 400,
        code: 'ERR_VALID',
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
export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new TicketRepository()
    const ticketResource = new TicketResource(await repository.create(req.body))
    res.status(201).json({ ticket: ticketResource.item() })
  } catch (error) {
    next(error)
  }
}
