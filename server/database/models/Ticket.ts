import { Document, model, Schema, Types } from 'mongoose'

/**
 * Type to model the Price Schema for TypeScript.
 * @param qty:number
 * @param customer_type:string
 * @param base_price:number
 */
interface IPrice extends Document {
  qty: number
  customer_type: string
  base_price: number
}

/**
 * Type to model the Route Schema for TypeScript.
 * @param route_id:ref => Route._id
 * @param zones:string[]
 * @param prices:IPrice[]
 */
interface IRoute extends Document {
  route_id: Types.ObjectId
  zones: string[]
  prices: IPrice[]
}

/**
 * Type to model the Ticket Schema for TypeScript.
 * @param codigoQR:string
 * @param date_time:Date
 * @param start_station:string
 * @param end_station:string
 * @param kiosk_id:ref => Kiosk._id
 * @param method_name:string
 * @param total_price:number
 * @param route:IRoute
 */
interface ITicket extends Document {
  codigoQR: string
  date_time: Date
  start_station: string
  end_station: string
  kiosk_id: Types.ObjectId
  method_name: string
  total_price: number
  route: IRoute
}

const PriceSchema = new Schema<IPrice>({
  qty: { type: Number, required: true },
  customer_type: { type: String, required: true },
  base_price: { type: Number, required: true },
})

const RouteSchema = new Schema<IRoute>({
  route_id: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
  zones: [{ type: String, required: true }],
  prices: [PriceSchema],
})

const TicketSchema = new Schema<ITicket>({
  codigoQR: { type: String, required: true },
  date_time: { type: Date, required: true },
  start_station: { type: String, required: true },
  end_station: { type: String, required: true },
  kiosk_id: { type: Schema.Types.ObjectId, ref: 'Kiosk', required: true },
  method_name: { type: String, required: true },
  total_price: { type: Number, required: true },
  route: { type: RouteSchema, required: true },
})

const Ticket = model<ITicket>('Ticket', TicketSchema)
export default Ticket
