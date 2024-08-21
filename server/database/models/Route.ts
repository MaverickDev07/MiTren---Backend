import { Schema, model, Document } from 'mongoose'

type Stations = {
  station_code: string
  station_name: string
}
type Prices = {
  interstops: boolean
  customer_type: string
  base_price: number
}

export type RouteEntity = {
  id?: string | any
  route_code: string
  stations: Stations[]
  prices: Prices[]
}

export interface RouteAttributes extends RouteEntity, Document {}

const RouteSchema = new Schema<RouteAttributes>(
  {
    route_code: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      required: true,
    },

    stations: [
      {
        station_code: {
          type: String,
          uppercase: true,
          trim: true,
          required: true,
        },
        station_name: {
          type: String,
          uppercase: true,
          trim: true,
          required: true,
        },
      },
    ],
    prices: [
      {
        interstops: {
          type: Boolean,
          default: true,
        },
        customer_type: {
          type: String,
          uppercase: true,
          trim: true,
          required: true,
        },
        base_price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const Route = model<RouteAttributes>('Route', RouteSchema)

export default Route
