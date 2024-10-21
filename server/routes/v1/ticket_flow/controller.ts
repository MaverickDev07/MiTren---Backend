import { NextFunction, Request, Response } from 'express'
import StationPairPricesRepository from '../../../repositories/ticket_flow/StationPairPricesRepository'
import StationPairPricesResource from '../../../resources/ticket_flow/StationPairPricesResource'

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
