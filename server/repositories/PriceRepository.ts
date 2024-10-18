/* eslint-disable max-lines */
import { Schema } from 'mongoose'
import PriorityQueue from 'priorityqueuejs'
import Price, { PriceAttributes } from '../database/models/Price'
import BaseRepository from './BaseRepository'
import Line from '../database/models/Line'
import Station from '../database/models/Station'
import Route from '../database/models/Route'
import ApiError from '../errors/ApiError'

class QueueElement {
  node: string
  priority: number

  constructor(node: string, priority: number) {
    this.node = node
    this.priority = priority
  }
}

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
        // Si no hay ruta directa, encontrar la mejor ruta con transbordo
        const transferStation = await this.findTransferStation(start_lines_id, end_lines_id)
        console.log(transferStation)

        if (!transferStation) {
          throw new Error('No se encontró un punto de transbordo válido.')
        }

        const caminoLinea1 = await this.dijkstra(start_station_id, transferStation._id.toString())
        const caminoLinea2 = await this.dijkstra(transferStation._id.toString(), end_station_id)

        if (!caminoLinea1 || !caminoLinea2) {
          throw new Error('No se encontró un camino entre las estaciones.')
        }

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

        start_line = await this.getLineNameById(caminoLinea1.path[0])
        end_line = await this.getLineNameById(caminoLinea2.path[0])

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

  private async findTransferStation(
    start_lines: Array<Schema.Types.ObjectId>,
    end_lines: Array<Schema.Types.ObjectId>,
  ): Promise<any> {
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

  private async getLineNameById(line_id: Schema.Types.ObjectId): Promise<string> {
    const line = await Line.findById(line_id)
    return line ? line.line_name : ''
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

  private async dijkstra(start_station_id: string, end_station_id: string): Promise<any> {
    const distances: Record<string, number> = {}
    const previous: Record<string, string | null> = {}
    const pq = new PriorityQueue<{ node: string; priority: number }>(
      (a, b) => b.priority - a.priority,
    )

    pq.enq(new QueueElement(start_station_id, 0))
    distances[start_station_id.toString()] = 0
    previous[start_station_id.toString()] = null

    const routes = await Route.find()

    while (pq.size()) {
      const { node: currentId } = pq.deq()

      if (currentId.toString() === end_station_id.toString()) {
        const path: string[] = []
        let current: string | null = currentId

        while (current !== null) {
          path.push(current)
          current = previous[current.toString()]
        }

        path.reverse()

        return { station_id: currentId, distance: distances[currentId.toString()], path }
      }

      for (const route of routes) {
        const stationIndex = route.stations.findIndex(
          station => station.station_id.toString() === currentId.toString(),
        )

        // Agregar vecino anterior si existe
        if (stationIndex > 0) {
          const prevStation = route.stations[stationIndex - 1]
          console.log(prevStation)
          const alt = distances[currentId.toString()] + 1 // Ajustar el peso según la lógica de distancia
          if (alt < (distances[prevStation.station_id.toString()] || Infinity)) {
            distances[prevStation.station_id.toString()] = alt
            previous[prevStation.station_id.toString()] = currentId
            pq.enq(new QueueElement(prevStation.station_id.toString(), alt))
          }
        }

        // Agregar vecino siguiente si existe
        if (stationIndex < route.stations.length - 1) {
          const nextStation = route.stations[stationIndex + 1]
          const alt = distances[currentId.toString()] + 1 // Ajustar el peso según la lógica de distancia
          if (alt < (distances[nextStation.station_id.toString()] || Infinity)) {
            distances[nextStation.station_id.toString()] = alt
            previous[nextStation.station_id.toString()] = currentId
            pq.enq(new QueueElement(nextStation.station_id.toString(), alt))
          }
        }
      }
    }
    return null
  }
}
