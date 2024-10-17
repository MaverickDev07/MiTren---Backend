import { Types } from 'mongoose'
import Price, { PriceAttributes } from '../database/models/Price'
import Station from '../database/models/Station'
import BaseRepository from './BaseRepository'
import Line from '../database/models/Line'

export default class PriceRepository extends BaseRepository<PriceAttributes> {
  protected allowedSortByFields = ['customer_type', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['start_station', 'end_station']

  constructor() {
    super(Price)
  }

  async getPricesByStationPair(
    start_station_id: string | Types.ObjectId,
    end_station_id: string | Types.ObjectId,
  ): Promise<any> {
    const startStation = await Station.findById(start_station_id)
    const endStation = await Station.findById(end_station_id)

    const start_station = startStation.station_name
    const start_lines_id = startStation.line_id
    const end_station = endStation.station_name
    const end_lines_id = endStation.line_id

    let is_transfer = true
    let line_id = null
    let start_line = null
    let end_line = null

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

      const { line_name } = await Line.findById(line_id)
      start_line = end_line = line_name

      return {
        prices,
        start_point: { start_station, start_line },
        end_point: { end_station, end_line },
        transfer_point: {
          is_transfer,
          transfer_station: '',
        },
      }
    } else {
      // Si no hay ruta directa, encontrar la mejor ruta con transbordo
      const transferStation = await this.findTransferStation(start_lines_id, end_lines_id)

      if (!transferStation) {
        throw new Error('No se encontró un punto de transbordo válido.')
      }

      const caminoLinea1 = await this.encontrarCaminoMismaLinea(
        transferStation.line_id,
        start_station_id,
        transferStation.station_id,
      )

      const caminoLinea2 = await this.encontrarCaminoMismaLinea(
        transferStation.line_id,
        transferStation.station_id,
        end_station_id,
      )

      // Obtener precios para ambas partes del camino
      const prices1 = await Price.find({
        'start_station.station_id': start_station_id,
        'end_station.station_id': transferStation.station_id,
      }).exec()

      const prices2 = await Price.find({
        'start_station.station_id': transferStation.station_id,
        'end_station.station_id': end_station_id,
      }).exec()

      // Combinar y sumar precios por 'customer_type_id' coincidentes
      const totalPrices = this.sumarPrecios(prices1, prices2)

      const start_line = await this.getLineNameById(transferStation.line_id)
      const end_line = await this.getLineNameById(transferStation.line_id)

      return {
        prices: totalPrices,
        start_point: { start_station, start_line },
        end_point: { end_station, end_line },
        transfer_point: {
          is_transfer,
          transfer_station: transferStation.station_name,
        },
      }
    }
  }

  private async findTransferStation(
    start_lines: Types.ObjectId[],
    end_lines: Types.ObjectId[],
  ): Promise<any> {
    // Encuentra una estación de transferencia válida
    const transferStations = await Station.find({
      line_id: { $in: start_lines },
      is_transfer_stop: true,
    })

    for (const station of transferStations) {
      if (station.line_id.some(lineId => end_lines.includes(lineId))) {
        return station
      }
    }
    return null
  }

  private async encontrarCaminoMismaLinea(
    line_id: Types.ObjectId,
    start_station_id: Types.ObjectId,
    end_station_id: Types.ObjectId,
  ): Promise<any> {
    // Implementar lógica de Dijkstra para encontrar el mejor camino en la misma línea
  }

  private sumarPrecios(prices1: any[], prices2: any[]): any[] {
    // Logica para sumar precios basados en customer_type_id
    const priceMap = new Map()

    prices1.forEach(price => {
      priceMap.set(price.customer_type_id.toString(), price.base_price)
    })

    prices2.forEach(price => {
      const priceKey = price.customer_type_id.toString()
      if (priceMap.has(priceKey)) {
        priceMap.set(priceKey, priceMap.get(priceKey) + price.base_price)
      }
    })

    return Array.from(priceMap.entries()).map(([customer_type_id, base_price]) => ({
      customer_type_id,
      base_price,
    }))
  }

  private async getLineNameById(line_id: Types.ObjectId): Promise<string> {
    const line = await Line.findById(line_id)
    return line ? line.line_name : ''
  }
}
