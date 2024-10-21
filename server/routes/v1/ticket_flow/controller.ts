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
