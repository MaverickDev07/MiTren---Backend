import { Schema, model, Document } from 'mongoose'

export type WalletEntity = {
  id?: string | any
  code: string
  price: number
  currency: string
  amount_paid: number
  cash_back: number
  payment_methods: string
  created_on: Date
  status: string
  summary: string
}

export interface WalletAttributes extends WalletEntity, Document {}

const WalletSchema = new Schema<WalletAttributes>(
  {
    code: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      //emun: ['BOB'],
      default: 'BOB',
    },
    amount_paid: {
      type: Number,
      required: true,
    },
    cash_back: {
      type: Number,
      required: true,
    },
    payment_methods: {
      type: String,
      required: true,
    },
    created_on: {
      type: Date,
      default: new Date(),
    },
    status: {
      type: String,
      // enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDIENTE',
    },
    summary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const Wallet = model<WalletAttributes>('Wallet', WalletSchema)

export default Wallet
