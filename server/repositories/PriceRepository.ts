/* eslint-disable max-lines */
import { Schema } from 'mongoose'
import Price, { PriceAttributes } from '../database/models/Price'
import BaseRepository from './BaseRepository'
import Line from '../database/models/Line'
import Station from '../database/models/Station'
import Route from '../database/models/Route'
import ApiError from '../errors/ApiError'

export default class PriceRepository extends BaseRepository<PriceAttributes> {
  protected allowedSortByFields = ['customer_type', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['start_station', 'end_station']

  constructor() {
    super(Price)
  }

  async getPricesByStationPair(start_station_id: string, end_station_id: string): Promise<any> {
    try {
      const startStation = await Station.findById(start_station_id)
      const endStation = await Station.findById(end_station_id)

      if (!startStation || !endStation) {
        throw new ApiError({
          name: 'MODEL_NOT_FOUND_ERROR',
          message: 'No se encontró la estación',
          status: 400,
          code: 'ERR_MNF',
        })
      }

      const start_station = startStation.station_name
      const start_lines_id = startStation.line_id
      const end_station = endStation.station_name
      const end_lines_id = endStation.line_id

      let is_transfer = true
      let line_id: any = null
      let start_line: any = null
      let end_line: any = null

      // Verificar si hay una línea en común entre las estaciones de inicio y fin
      for (const startLine of start_lines_id) {
        for (const endLine of end_lines_id) {
          if (startLine.toString() === endLine.toString()) {
            is_transfer = false
            line_id = startLine
            break
          }
        }
      }

      if (!is_transfer) {
        // Ruta directa sin transbordo
        const prices = await Price.find({
          'start_station.station_id': start_station_id,
          'end_station.station_id': end_station_id,
        })
          .select({ base_price: 1, customer_type: 1 })
          .sort({ base_price: -1 })
          .exec()

        const line_direct = await Line.findById(line_id)
        if (!line_direct) throw new Error('No se encontró la línea directa entre las estaciones.')
        const line_name = line_direct.line_name
        start_line = end_line = line_name

        return {
          prices,
          start_point: { start_station, start_line },
          end_point: { end_station, end_line },
          transfer_point: { is_transfer, transfer_station: '' },
        }
      } else {
        // Encontrar la mejor estación de trasbordo
        const transferStation = await this.findBestTransferStation(
          start_lines_id,
          end_lines_id,
          start_station_id,
          end_station_id,
        )

        const prices1 = await Price.find({
          'start_station.station_id': start_station_id,
          'end_station.station_id': transferStation._id,
        }).exec()

        const prices2 = await Price.find({
          'start_station.station_id': transferStation._id,
          'end_station.station_id': end_station_id,
        }).exec()

        // Combinar y sumar precios por 'customer_type' coincidentes
        const totalPrices = this.sumarPrecios(prices1, prices2)

        start_line = startStation.station_name
        end_line = endStation.station_name

        return {
          prices: totalPrices,
          start_point: { start_station, start_line },
          end_point: { end_station, end_line },
          transfer_point: { is_transfer, transfer_station: transferStation.station_name },
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Reemplazamos el uso de reduce con un bucle for...of para manejar las promesas correctamente
  private async findBestTransferStation(
    start_lines_id: Schema.Types.ObjectId[],
    end_lines_id: Schema.Types.ObjectId[],
    start_station_id: string,
    end_station_id: string,
  ): Promise<any> {
    const transferStations = await Station.find({
      is_transfer_stop: true, // Debe ser una estación de trasbordo
      $and: [
        { line_id: { $in: start_lines_id } }, // Debe pertenecer a una de las líneas de inicio
        { line_id: { $in: end_lines_id } }, // También debe estar conectada a una de las líneas de destino
      ],
    }).exec()

    if (transferStations.length === 0) {
      /*throw new ApiError({
        name: 'NO_TRANSFER_FOUND',
        message: 'No se encontró una estación de trasbordo válida.',
        status: 400,
        code: 'ERR_NO_TRANSFER',
      })*/
      throw new Error('No se encontró una estación de trasbordo válida.')
    }

    let bestTransferStation: { station: any; totalStops: number } | null = null

    for (const current of transferStations) {
      // Obtener la ruta desde la estación de inicio a la estación de trasbordo actual
      const routeToTransfer = await Route.findOne({
        'start_station.station_id': start_station_id,
        'end_station.station_id': current._id,
      }).exec()

      // Obtener la ruta desde la estación de trasbordo actual a la estación de destino
      const routeFromTransfer = await Route.findOne({
        'start_station.station_id': current._id,
        'end_station.station_id': end_station_id,
      }).exec()

      if (!routeToTransfer || !routeFromTransfer) {
        // Si alguna de las rutas no existe, descartar esta estación de trasbordo
        continue
      }

      // Calcular el total de estaciones (paradas) entre la estación de partida y la estación de destino, pasando por la estación de trasbordo
      const totalStops = routeToTransfer.stations.length + routeFromTransfer.stations.length

      // Comparar la cantidad de estaciones (paradas) con la mejor opción actual
      if (!bestTransferStation || totalStops < bestTransferStation.totalStops) {
        bestTransferStation = {
          station: current,
          totalStops,
        }
      }
    }

    if (!bestTransferStation) {
      /*throw new ApiError({
        name: 'NO_TRANSFER_FOUND',
        message: 'No se encontró una estación de trasbordo válida con rutas completas.',
        status: 400,
        code: 'ERR_NO_TRANSFER',
      })*/
      throw new Error('No se encontró una estación de trasbordo válida con rutas completas.')
    }

    return bestTransferStation.station
  }

  private sumarPrecios(prices1: any[], prices2: any[]): any[] {
    const priceMap = new Map()
    prices1.forEach(price => {
      priceMap.set(price.customer_type, price.base_price)
    })

    prices2.forEach(price => {
      const priceKey = price.customer_type
      if (priceMap.has(priceKey)) {
        priceMap.set(priceKey, priceMap.get(priceKey) + price.base_price)
      }
    })

    return Array.from(priceMap.entries()).map(([customer_type, base_price]) => ({
      customer_type,
      base_price,
    }))
  }
}
