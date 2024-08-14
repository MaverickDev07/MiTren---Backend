import { Document, model, Schema, Types } from 'mongoose'

/**
 * Type to model the Route Schema for TypeScript.
 * @param route_code:string
 * @param zones:string[]
 * @param prices:IPrice[]
 */
interface IPrice extends Document {
  qty: number
  customer_type: string
  base_price: number
}

interface IRoute extends Document {
  route_code: string
  zones: string[]
  prices: IPrice[]
}

const PriceSchema = new Schema<IPrice>({
  qty: { type: Number, required: true },
  customer_type: { type: String, required: true },
  base_price: { type: Number, required: true },
})

const RouteSchema = new Schema<IRoute>({
  route_code: { type: String, required: true },
  zones: [{ type: String, required: true }],
  prices: [PriceSchema],
})

const Route = model<IRoute>('Route', RouteSchema)
export default Route
