/* eslint-disable max-lines */
import { Types } from 'mongoose'
import Price, { PriceAttributes } from '../database/models/Price'
import Route from '../database/models/Route'
import ApiError from '../errors/ApiError'
import BaseRepository from './BaseRepository'
import CustomerType from '../database/models/CustomerType'

export default class PriceRepository extends BaseRepository<PriceAttributes> {
  protected allowedSortByFields = ['customer_type', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['customer_type', 'start_station', 'end_station', 'createdAt']

  constructor() {
    super(Price)
  }

  async createOrUpdate(prices: any): Promise<any> {
    let modifiedCount = 0
    let upsertedCount = 0

    for (const price of prices) {
      for (const c_type of price.prices) {
        const priceData = {
          base_price: c_type.base_price,
          customer_type: c_type.customer_type,
          customer_type_id: c_type.customer_type_id,
          start_station: price.start_station,
          end_station: price.end_station,
        }

        const createOrUpdatePrice = await Price.updateOne(
          {
            customer_type: priceData.customer_type.toUpperCase(),
            customer_type_id: priceData.customer_type_id,
            'start_station.station_id': priceData.start_station.station_id,
            'end_station.station_id': priceData.end_station.station_id,
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
    }
  }

  async getByLineId(id: string | Types.ObjectId, params: any): Promise<any> {
    // Promise<Array<any>>
    const { limit, page } = params
    const route = await Route.findOne({ line_id: id, status: 'ACTIVE' }).exec()
    const customerTypes = await CustomerType.find({ status: 'ACTIVE' }).exec()
    const docs: any = []

    if (!route) {
      throw new ApiError({
        name: 'STATIONS_NOT_IN_ROUTE',
        message: 'Las estaciones no pertenecen a la misma ruta.',
        status: 400,
        code: 'ERR_SNR',
      })
    }

    // Obtener todas las combinaciones de estaciones en la ruta
    for (const [index, start_station] of route.stations.entries()) {
      for (const end_station of route.stations.slice(index + 1)) {
        const prices = []
        for (const customer_type of customerTypes) {
          const price: any = await Price.findOne({
            customer_type_id: customer_type.id,
            customer_type: customer_type.customer_type,
            'start_station.station_id': start_station.station_id,
            'end_station.station_id': end_station.station_id,
          })
          prices.push({
            customer_type_id: customer_type.id,
            customer_type: customer_type.customer_type,
            base_price: price ? price.base_price : 0,
          })
        }

        docs.push({
          start_station,
          end_station,
          prices,
        })
      }
    }

    // Realizar la paginación manualmente
    const totalDocs = docs.length
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const hasPrevPage = page > 1
    const hasNextPage = endIndex < totalDocs
    const prevPage = hasPrevPage ? page - 1 : null
    const nextPage = hasNextPage ? page + 1 : null

    const paginated = docs.slice(startIndex, endIndex)

    // Devolver paginación
    const paginacion = {
      docs: paginated,
      totalDocs,
      limit,
      totalPages: Math.ceil(totalDocs / limit),
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    }

    return paginacion
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
