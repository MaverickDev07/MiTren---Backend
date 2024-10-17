/* eslint-disable max-lines */
import { Schema } from 'mongoose'
import TinyQueue from 'tinyqueue'
import Price, { PriceAttributes } from '../database/models/Price'
import BaseRepository from './BaseRepository'
import Line from '../database/models/Line'
import Station from '../database/models/Station'
import Route from '../database/models/Route'
import ApiError from '../errors/ApiError'

/**
 * Repositorio para manejar precios de viajes.
 */
export default class PriceRepository extends BaseRepository<PriceAttributes> {
  /**
   * Campos permitidos para ordenar resultados.
   */
  protected allowedSortByFields = ['customer_type', 'status', 'createdAt', 'updatedAt']

  /**
   * Campos permitidos para filtrar resultados.
   */
  protected allowedFilterByFields = ['start_station', 'end_station']

  /**
   * Constructor.
   */
  constructor() {
    super(Price)
  }

  /**
   * Obtiene precios de viajes por par de estaciones.
   *
   * @param {string} _start_station_id - ID de la estación de inicio.
   * @param {string} _end_station_id - ID de la estación de fin.
   * @returns {Promise<any>} Precios de viajes y información de estaciones.
   */
  async getPricesByStationPair(_start_station_id: string, _end_station_id: string): Promise<any> {
    try {
      const start_station_id = new Schema.Types.ObjectId(_start_station_id)
      const end_station_id = new Schema.Types.ObjectId(_end_station_id)

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
          transfer_point: { is_transfer, transfer_station: '' },
        }
      } else {
        // Si no hay ruta directa, encontrar la mejor ruta con transbordo
        const transferStation = await this.findTransferStation(start_lines_id, end_lines_id)

        if (!transferStation) {
          throw new Error('No se encontró un punto de transbordo válido.')
        }

        const caminoLinea1 = await this.dijkstra(start_station_id, transferStation._id)
        const caminoLinea2 = await this.dijkstra(transferStation._id, end_station_id)

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
      throw new Error(error)
    }
  }

  /**
   * Encuentra una estación de transferencia válida.
   *
   * @param {Array<Schema.Types.ObjectId>} start_lines - Líneas de la estación de inicio.
   * @param {Array<Schema.Types.ObjectId>} end_lines - Líneas de la estación de fin.
   * @returns {Promise<any>} Estación de transferencia.
   */
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

  /**
   * Obtiene el nombre de una línea por su ID.
   *
   * @param {Schema.Types.ObjectId} line_id - ID de la línea.
   * @returns {Promise<string>} Nombre de la línea.
   */
  private async getLineNameById(line_id: Schema.Types.ObjectId): Promise<string> {
    const line = await Line.findById(line_id)
    return line ? line.line_name : ''
  }

  /**
   * Suma precios de viajes por 'customer_type' coincidentes.
   *
   * @param {any[]} prices1 - Precios de viajes 1.
   * @param {any[]} prices2 - Precios de viajes 2.
   * @returns {any[]} Precios sumados.
   */
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

  /**
   * Implementación del algoritmo de Dijkstra.
   *
   * @param {Schema.Types.ObjectId} start_station_id - ID de la estación de inicio.
   * @param {Schema.Types.ObjectId} end_station_id - ID de la estación de fin.
   * @returns {Promise<any>} Camino más corto.
   */
  private async dijkstra(
    start_station_id: Schema.Types.ObjectId,
    end_station_id: Schema.Types.ObjectId,
  ): Promise<any> {
    const distances: Record<string, number> = {}
    const previous: Record<string, Schema.Types.ObjectId | null> = {}
    const pq = new TinyQueue<{ node: Schema.Types.ObjectId; priority: number }>(
      [],
      (a, b) => a.priority - b.priority,
    )

    pq.push({ node: start_station_id, priority: 0 })
    distances[start_station_id.toString()] = 0
    previous[start_station_id.toString()] = null

    while (pq.length) {
      const { node: currentId } = pq.pop()

      if (currentId.toString() === end_station_id.toString()) {
        const path: Schema.Types.ObjectId[] = []
        let current: Schema.Types.ObjectId | null = currentId

        while (current !== null) {
          path.push(current)
          current = previous[current.toString()]
        }

        path.reverse()

        return { station_id: currentId, distance: distances[currentId.toString()], path }
      }

      const neighbors = await this.getNeighbors(currentId)

      for (const neighbor of neighbors) {
        const alt = distances[currentId.toString()] + neighbor.weight

        if (alt < (distances[neighbor.station_id.toString()] || Infinity)) {
          distances[neighbor.station_id.toString()] = alt
          previous[neighbor.station_id.toString()] = currentId
          pq.push({ node: new Schema.Types.ObjectId(neighbor.station_id), priority: alt })
        }
      }
    }

    return null
  }

  /**
   * Obtiene los vecinos de una estación.
   *
   * @param {Schema.Types.ObjectId} station_id - ID de la estación.
   * @returns {Promise<any[]>} Vecinos de la estación.
   */
  private async getNeighbors(station_id: Schema.Types.ObjectId): Promise<any[]> {
    const routes = await Route.find({
      'stations.station_id': station_id,
    })

    const neighbors = []

    for (const route of routes) {
      // Buscamos la estación en la ruta
      const stationIndex = route.stations.findIndex(
        station => station.station_id.toString() === station_id.toString(),
      )

      // Agregamos el vecino anterior si existe
      if (stationIndex > 0) {
        const previousStation = route.stations[stationIndex - 1]
        neighbors.push({
          station_id: previousStation.station_id,
          weight: 1, // Ajustar el peso según la lógica de distancia que utilices
        })
      }

      // Agregamos el vecino siguiente si existe
      if (stationIndex < route.stations.length - 1) {
        const nextStation = route.stations[stationIndex + 1]
        neighbors.push({
          station_id: nextStation.station_id,
          weight: 1, // Ajustar el peso según la lógica de distancia que utilices
        })
      }
    }

    return neighbors
  }
}
