import Price, { PriceAttributes } from '../database/models/Price'
import Route from '../database/models/Route'
import ApiError from '../errors/ApiError'
import BaseRepository from './BaseRepository'

export default class PriceRepository extends BaseRepository<PriceAttributes> {
  protected allowedSortByFields = ['customer_type', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['start_station', 'end_station']

  constructor() {
    super(Price)
  }

  async createOrUpdatePrices(start_station_id: string, end_station_id: string): Promise<any> {
    const route = await Route.findOne({
      'stations.station_id': { $all: [start_station_id, end_station_id] },
    })

    if (!route) {
      throw new ApiError({
        name: 'MODEL_NOT_FOUND_ERROR',
        message: 'No se encontró la ruta',
        status: 400,
        code: 'ERR_MNF',
      })
    }
    return route
  }
}
