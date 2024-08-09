import { Document, model, Schema, Types } from 'mongoose';

/**
 * Type to model the CardNFC Schema for TypeScript.
 * @param user_id:ref => User._id
 * @param customer_id:ref => Customer._id
 * @param card_code:string
 * @param balance:number
 * @param issue_date:Date
 * @param status:string
 */
interface ICardNFC extends Document {
  user_id: Types.ObjectId;
  customer_id: Types.ObjectId;
  card_code: string;
  balance: number;
  issue_date: Date;
  status: string;
}

const CardNFCSchema = new Schema<ICardNFC>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  card_code: { type: String, required: true },
  balance: { type: Number, required: true },
  issue_date: { type: Date, required: true },
  status: { type: String, required: true }
});

const CardNFC = model<ICardNFC>('CardNFC', CardNFCSchema);
export default CardNFC;
