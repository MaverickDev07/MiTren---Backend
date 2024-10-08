import { Schema, model, Document } from 'mongoose'

type Price = {
  qty: number
  customer_type: string
  base_price: number
}

type Route = {
  line_name: string
  stations: Array<string>
  prices: Array<Price>
}

export type TicketEntity = {
  id?: string | any
  start_station: string
  end_station: string
  kiosk_id: Schema.Types.ObjectId
  method_name: string
  id_qr?: string | null
  is_transfer?: boolean
  promotion_title?: string
  total_price?: number
  route: Route
  status?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface TicketAttributes extends TicketEntity, Document {}

const TicketSchema = new Schema<TicketAttributes>(
  {
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
    id_qr: {
      type: String,
      trim: true,
      // unique: true,
    },
    is_transfer: {
      type: Boolean,
      default: false,
    },
    promotion_title: {
      type: String,
      uppercase: true,
      trim: true,
      default: 'SIN PROMOCIÓN',
    },
    total_price: {
      type: Number,
      min: 0.1,
      required: true,
    },
    route: {
      line_name: {
        type: String,
        uppercase: true,
        trim: true,
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
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      uppercase: true,
      trim: true,
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const Ticket = model<TicketAttributes>('Ticket', TicketSchema)

export default Ticket
