import { Document, model, Schema, Types } from 'mongoose';

/**
 * Type to model the Zone Schema for TypeScript.
 * @param zone_code:string
 * @param zone_name:string
 * @param stations:ref => Station._id[]
 * @param line_id:ref => Line._id
 */
interface IZone extends Document {
  zone_code: string;
  zone_name: string;
  stations: Types.ObjectId[];
  line_id: Types.ObjectId;
}

const ZoneSchema = new Schema<IZone>({
  zone_code: { type: String, required: true },
  zone_name: { type: String, required: true },
  stations: [{ type: Schema.Types.ObjectId, ref: 'Station' }],
  line_id: { type: Schema.Types.ObjectId, ref: 'Line', required: true }
});

const Zone = model<IZone>('Zone', ZoneSchema);
export default Zone;
