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

    stations: {
      type: [
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
      required: true,
      validate: {
        validator: (value: Stations[]) => {
          return value.length > 1
        },
        message: 'El array "stations" debe contener al menos dos ítems.',
      },
    },

    prices: {
      type: [
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
      required: true,
      validate: {
        validator: (value: Prices[]) => {
          return value.length > 0
        },
        message: 'El array "prices" debe contener al menos un ítem.',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const Route = model<RouteAttributes>('Route', RouteSchema)

export default Route
