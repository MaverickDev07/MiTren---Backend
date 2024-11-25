import bcrypt from 'bcryptjs'

import User, { UserAttributes } from '../database/models/User'
import ApiError from '../errors/ApiError'
import BaseRepository from './BaseRepository'
import { Types, UpdateQuery } from 'mongoose'

export default class UserRepository extends BaseRepository<UserAttributes> {
  protected allowedSortByFields = ['doc_type', 'role_name', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['email', 'name', 'lastname', 'doc_number']

  constructor() {
    super(User)
  }

  async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  }

  async comparePassword(password: string, receivedPassword: string) {
    return await bcrypt.compare(password, receivedPassword)
  }

  async updatePasswordByUserId(userId: string | Types.ObjectId, data: UpdateQuery<UserAttributes>) {
    data.password = await this.encryptPassword(data.password)

    return this.model.findByIdAndUpdate(userId, data, { new: true }).exec()
  }

  getAuthUserByEmail(email: string): Promise<UserAttributes | null> {
    return this.model.findOne({ email }).exec()
  }
}
