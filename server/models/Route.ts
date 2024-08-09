import { Document, model, Schema, Types } from 'mongoose';

/**
 * Type to model the Route Schema for TypeScript.
 * @param route_code:string
 * @param zones:string[]
 * @param prices:IPrice[]
 */
interface IRoute extends Document {
  route_code: string;
  zones: string[];
  prices: IPrice[];
}

const RouteSchema = new Schema<IRoute>({
  route_code: { type: String, required: true },
  zones: [{ type: String, required: true }],
  prices: [PriceSchema]
});

const Route = model<IRoute>('Route', RouteSchema);
export default Route;
