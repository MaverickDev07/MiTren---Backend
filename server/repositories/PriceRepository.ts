/* eslint-disable max-lines */
import { Schema } from 'mongoose'
import PriorityQueue from 'js-priority-queue'
import Price, { PriceAttributes } from '../database/models/Price'
import BaseRepository from './BaseRepository'
import Line from '../database/models/Line'
import Station from '../database/models/Station'
import ApiError from '../errors/ApiError'
import Route from '../database/models/Route'

export default class PriceRepository extends BaseRepository<PriceAttributes> {
  protected allowedSortByFields = ['customer_type', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['start_station', 'end_station']

  constructor() {
    super(Price)
  }

  async getPricesByStationPair(
    start_station_id: Schema.Types.ObjectId | string,
    end_station_id: Schema.Types.ObjectId | string,
  ): Promise<any> {
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
        transferStation._id,
      )
      const route_line_id1 = caminoLinea1.route_line_id
      const updatedLines = this.removeLineId(transferStation.line_id, route_line_id1)

      const caminoLinea2 = await this.encontrarCaminoMismaLinea(
        updatedLines,
        transferStation._id,
        end_station_id,
      )
      const route_line_id2 = caminoLinea2.route_line_id

      // Obtener precios para ambas partes del camino
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

      start_line = await this.getLineNameById(route_line_id1)
      end_line = await this.getLineNameById(route_line_id2)

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

  private removeLineId(
    lines_id: Array<Schema.Types.ObjectId>,
    route_line_id: Schema.Types.ObjectId,
  ): Array<Schema.Types.ObjectId> {
    return lines_id.filter(line_id => line_id.toString() !== route_line_id.toString())
  }

  private async findTransferStation(
    start_lines: Array<Schema.Types.ObjectId>,
    end_lines: Array<Schema.Types.ObjectId>,
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
    lines_id: Array<Schema.Types.ObjectId>,
    start_station_id: Schema.Types.ObjectId | string,
    end_station_id: Schema.Types.ObjectId | string,
  ): Promise<any> {
    // Obtener la ruta de la línea especificada
    const route = await Route.findOne({ line_id: { $in: lines_id } }).exec() // .populate('stations.station_id')

    if (!route) {
      throw new Error('No se encontró la ruta para esta línea.')
    }

    const stations = route.stations
    const path: Schema.Types.ObjectId[] = []
    let distance = -1 // Contador de distancia entre estaciones
    let foundStart = false

    // Recorrer las estaciones de la ruta
    for (let i = 0; i < stations.length; i++) {
      const station = stations[i]
      const station_id = station.station_id

      if (station_id.toString() === start_station_id.toString()) {
        foundStart = true // Se encontró la estación de inicio
        distance = 0 // Reiniciar la distancia
      }

      if (foundStart) {
        path.push(station_id) // Agregar la estación al camino

        // Si encontramos la estación de destino, retornar el resultado
        if (station_id.toString() === end_station_id.toString()) {
          return { path, distance: distance + 1, route_line_id: route.line_id } // Retornamos el camino y la distancia
        }

        distance++ // Incrementar la distancia
      }
    }

    throw new Error('No se encontró un camino entre las estaciones.')
  }

  private sumarPrecios(prices1: any[], prices2: any[]): any[] {
    // Logica para sumar precios basados en customer_type_id
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

  private async getLineNameById(line_id: Schema.Types.ObjectId | string): Promise<string> {
    const line = await Line.findById(line_id)
    return line ? line.line_name : ''
  }

  private async dijkstra(
    start_station_id: Schema.Types.ObjectId,
    end_station_id: Schema.Types.ObjectId,
  ): Promise<{ station_id: Schema.Types.ObjectId; distance: number } | null> {
    // Mapa para almacenar la distancia mínima a cada estación
    const distances = new Map<string, number>()
    // Mapa para rastrear el predecesor de cada estación
    const previousStations = new Map<string, Schema.Types.ObjectId>()

    // Inicializar la cola de prioridad
    const pq = new PriorityQueue<{ node: Schema.Types.ObjectId; priority: number }>({
      comparator: (a: any, b: any) => a.priority - b.priority,
    })

    // Inicializar la distancia al nodo de inicio y agregarlo a la cola
    distances.set(start_station_id.toString(), 0)
    pq.queue({ node: start_station_id, priority: 0 })

    while (pq.length > 0) {
      const { node: currentStationId } = pq.dequeue()

      // Si alcanzamos la estación final, reconstruir la ruta
      if (currentStationId.toString() === end_station_id.toString()) {
        const transferStationId = await this.findOptimalTransferStation(
          previousStations,
          end_station_id,
        )
        const transferDistance = distances.get(transferStationId.toString()) || Infinity
        return { station_id: transferStationId, distance: transferDistance }
      }

      const currentDistance = distances.get(currentStationId.toString()) || Infinity

      // Obtener las rutas que pasan por la estación actual
      const routes = await Route.find({ 'stations.station_id': currentStationId }).exec()

      for (const route of routes) {
        const stations = route.stations.map(station => station.station_id)
        const currentIndex = stations.findIndex(id => id.toString() === currentStationId.toString())

        // Evaluar vecinos adyacentes
        const adjacentStations = this.getAdjacentStations(stations, currentIndex)

        for (const adjacentStationId of adjacentStations) {
          const distanceToNeighbor = currentDistance + 1 // Suponiendo distancia 1 entre estaciones consecutivas

          if (distanceToNeighbor < (distances.get(adjacentStationId.toString()) || Infinity)) {
            distances.set(adjacentStationId.toString(), distanceToNeighbor)
            previousStations.set(adjacentStationId.toString(), currentStationId)
            pq.queue({ node: adjacentStationId, priority: distanceToNeighbor })
          }
        }
      }
    }

    return null // No se encontró ruta
  }

  // Función auxiliar para obtener estaciones adyacentes (previamente ordenadas)
  private getAdjacentStations(
    stations: Schema.Types.ObjectId[],
    index: number,
  ): Schema.Types.ObjectId[] {
    const adjacentStations = []
    if (index > 0) adjacentStations.push(stations[index - 1])
    if (index < stations.length - 1) adjacentStations.push(stations[index + 1])
    return adjacentStations
  }

  // Función auxiliar para encontrar la mejor estación de transbordo
  private async findOptimalTransferStation(
    previousStations: Map<string, Schema.Types.ObjectId>,
    end_station_id: Schema.Types.ObjectId,
  ): Promise<Schema.Types.ObjectId> {
    let transferStationId = end_station_id
    while (previousStations.has(transferStationId.toString())) {
      transferStationId = previousStations.get(transferStationId.toString())!
    }
    return transferStationId
  }
}
