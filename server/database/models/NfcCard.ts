import { Schema, model, Document } from 'mongoose'

type User = {
  user_id: Schema.Types.ObjectId
  name: string
  lastname: string
  doc_type: string
  doc_number: string
}

type Customer = {
  cusomer_id: Schema.Types.ObjectId
  name: string
  lastname: string
  doc_type: string
  doc_number: string
}

export type NfcCardEntity = {
  id?: string | any
  card_code: string
  balance: number
  issue_date: Date
  status?: string
  user: User
  customer: Customer
  createdAt?: Date
  updatedAt?: Date
}

export interface NfcCardAttributes extends NfcCardEntity, Document {}

const NfcCardSchema = new Schema<NfcCardAttributes>(
  {
    card_code: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    issue_date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'],
      uppercase: true,
      trim: true,
      default: 'ACTIVE',
    },
    user: {
      user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        uppercase: true,
        trim: true,
        required: true,
      },
      lastname: {
        type: String,
        uppercase: true,
        trim: true,
        required: true,
      },
      doc_type: {
        type: String,
        enum: ['Carnet Identidad', 'Pasaporte', 'NIT'],
        uppercase: true,
        trim: true,
        required: true,
      },
      doc_number: {
        type: String,
        trim: true,
        required: true,
      },
    },
    customer: {
      customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
      },
      name: {
        type: String,
        uppercase: true,
        trim: true,
        required: true,
      },
      lastname: {
        type: String,
        uppercase: true,
        trim: true,
        required: true,
      },
      doc_type: {
        type: String,
        enum: ['Carnet Identidad', 'Pasaporte', 'NIT'],
        uppercase: true,
        trim: true,
        required: true,
      },
      doc_number: {
        type: String,
        trim: true,
        required: true,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const NfcCard = model<NfcCardAttributes>('NfcCard', NfcCardSchema)

export default NfcCard
