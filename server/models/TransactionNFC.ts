import { Document, model, Schema, Types } from 'mongoose';

/**
 * Type to model the TransactionNFC Schema for TypeScript.
 * @param card_id:ref => CardNFC._id
 * @param method_id:ref => Method._id
 * @param type:string
 * @param amount:number
 * @param date_time:Date
 */
interface ITransactionNFC extends Document {
  card_id: Types.ObjectId;
  method_id: Types.ObjectId;
  type: string;
  amount: number;
  date_time: Date;
}

const TransactionNFCSchema = new Schema<ITransactionNFC>({
  card_id: { type: Schema.Types.ObjectId, ref: 'CardNFC', required: true },
  method_id: { type: Schema.Types.ObjectId, ref: 'Method', required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  date_time: { type: Date, required: true }
});

const TransactionNFC = model<ITransactionNFC>('TransactionNFC', TransactionNFCSchema);
export default TransactionNFC;
