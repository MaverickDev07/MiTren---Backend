import { Schema, model, Document } from 'mongoose'

export type UserEntity = {
  id?: string | any
  email: string
  password: string
  name: string
  lastname: string
  doc_type: string
  doc_number: string
  address: string
  role_name: string
  status?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface UserAttributes extends UserEntity, Document {}

const UserSchema = new Schema<UserAttributes>({
  email: {
    type: String,
    uppercase: true,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
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
    unique: true,
    required: true,
  },
  role_name: {
    type: String,
    enum: ['ROOT', 'ADMIN', 'BOLETERIA'],
    uppercase: true,
    trim: true,
    required: true,
  },
  address: {
    type: String,
    uppercase: true,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    uppercase: true,
    trim: true,
    default: 'ACTIVE',
  },
})

const User = model<UserAttributes>('User', UserSchema)
export default User
