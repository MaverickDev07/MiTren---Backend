import { Schema, model, Document } from 'mongoose'

export type NfcTransactionEntity = {
  id?: string | any
  type: string
  amount: number
  date_time: Date
  card_id: Schema.Types.ObjectId
}

export interface NfcTransactionAttributes extends NfcTransactionEntity, Document {}

const NfcTransactionSchema = new Schema<NfcTransactionAttributes>(
  {
    type: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date_time: {
      type: Date,
      default: Date.now,
    },
    card_id: {
      type: Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const NfcTransaction = model<NfcTransactionAttributes>('NfcTransaction', NfcTransactionSchema)

export default NfcTransaction
