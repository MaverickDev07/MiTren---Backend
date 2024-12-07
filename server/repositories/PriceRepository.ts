import { Types } from 'mongoose'
import Price, { PriceAttributes } from '../database/models/Price'
import Route from '../database/models/Route'
import ApiError from '../errors/ApiError'
import BaseRepository from './BaseRepository'

export default class PriceRepository extends BaseRepository<PriceAttributes> {
  protected allowedSortByFields = ['customer_type', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['customer_type', 'start_station', 'end_station', 'createdAt']

  constructor() {
    super(Price)
  }

  getByLineId(id: string | Types.ObjectId): Promise<Array<PriceAttributes>> {
    console.log(id)
    return this.model.find().exec()
  }

  async createOrUpdatePrices(
    start_station_id: string,
    end_station_id: string,
    price: any,
  ): Promise<any> {
    const route = await Route.findOne({
      'stations.station_id': { $all: [start_station_id, end_station_id] },
    })

    if (!route) {
      throw new ApiError({
        name: 'STATIONS_NOT_IN_ROUTE',
        message: 'Las estaciones no pertenecen a la misma ruta.',
        status: 400,
        code: 'ERR_SNR',
      })
    }

    // Encuentra los índices de las estaciones de inicio y fin en el array 'stations'
    const startIndex = route.stations.findIndex(
      station => station.station_id.toString() === start_station_id,
    )
    const endIndex = route.stations.findIndex(
      station => station.station_id.toString() === end_station_id,
    )

    // Extrae el rango de estaciones
    const selectedStations = route.stations.slice(startIndex, endIndex + 1)
    let modifiedCount = 0
    let upsertedCount = 0

    for (const [index1, station1] of selectedStations.entries()) {
      for (const station2 of selectedStations.slice(index1 + 1)) {
        const priceData = {
          ...price,
          start_station: {
            station_id: station1.station_id,
            station_name: station1.station_name,
          },
          end_station: {
            station_id: station2.station_id,
            station_name: station2.station_name,
          },
        }

        const createOrUpdatePrice = await Price.updateOne(
          {
            customer_type: price.customer_type.toUpperCase(),
            customer_type_id: price.customer_type_id,
            'start_station.station_id': station1.station_id,
            'end_station.station_id': station2.station_id,
          },
          priceData,
          { upsert: true },
        )

        if (createOrUpdatePrice.upsertedCount) {
          upsertedCount++
        }
        if (createOrUpdatePrice.modifiedCount) {
          modifiedCount++
        }
      }
    }

    return {
      upsertedCount,
      modifiedCount,
      rangeStations: selectedStations.map(station => station.station_name),
    }
  }
}
