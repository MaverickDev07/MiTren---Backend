import { Schema, model, Document } from 'mongoose'

export type WalletEntity = {
  id?: string | any
  price: number
  currency?: string
  amount_paid?: number
  cash_back?: number
  summary?: string
  status?: string
}

export interface WalletAttributes extends WalletEntity, Document {}

const WalletSchema = new Schema<WalletAttributes>(
  {
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      emun: ['BOB'],
      required: true,
    },
    amount_paid: {
      type: Number,
      required: true,
    },
    cash_back: {
      type: Number,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const Wallet = model<WalletAttributes>('Wallet', WalletSchema)

export default Wallet
