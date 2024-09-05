import { Schema, model, Document } from 'mongoose'

type Price = {
  qty: number
  customer_type: string
  base_price: number
}

type Route = {
  route_id: Schema.Types.ObjectId
  stations: Array<string>
  prices: Array<Price>
}

export type TicketEntity = {
  id?: string | any
  qr_code: string
  date_time: Date
  start_station: string
  end_station: string
  kiosk_id: Schema.Types.ObjectId
  method_name: string
  transfer: boolean
  promotion_title: string
  total_price: number
  route: Route
}

export interface TicketAttributes extends TicketEntity, Document {}

const TicketSchema = new Schema<TicketAttributes>(
  {
    qr_code: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    date_time: {
      type: Date,
      required: true,
    },
    start_station: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },
    end_station: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },
    kiosk_id: {
      type: Schema.Types.ObjectId,
      ref: 'Kiosk',
      required: true,
    },
    method_name: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },
    transfer: {
      type: Boolean,
      default: false,
    },
    promotion_title: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },
    total_price: {
      type: Number,
      min: 0,
      required: true,
    },
    route: {
      route_id: {
        type: Schema.Types.ObjectId,
        ref: 'Route',
        required: true,
      },
      stations: {
        type: [String],
        min: 2,
        required: true,
      },
      prices: {
        type: [
          {
            qty: {
              type: Number,
              min: 1,
              required: true,
            },
            customer_type: {
              type: String,
              uppercase: true,
              trim: true,
              required: true,
            },
            base_price: {
              type: Number,
              min: 1,
              required: true,
            },
          },
        ],
        required: true,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const Ticket = model<TicketAttributes>('Ticket', TicketSchema)

export default Ticket
