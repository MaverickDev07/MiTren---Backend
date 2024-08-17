import { Schema, model, Document } from 'mongoose'

export type UserEntity = {
  id?: string | any
  email: string
  password: string
  name: string
  lastname: string
  doc_type: string
  doc_number: string
  status: string
  role_id: Schema.Types.ObjectId
}

export interface UserAttributes extends UserEntity, Document {}

const UserSchema = new Schema<UserAttributes>({
  role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  doc_type: { type: String, required: true },
  doc_number: { type: String, required: true },
  status: { type: String, required: true },
})

const User = model<UserAttributes>('User', UserSchema)
export default User
