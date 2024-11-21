import bcrypt from 'bcryptjs'

import User, { UserAttributes } from '../database/models/User'
import ApiError from '../errors/ApiError'
import BaseRepository from './BaseRepository'

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

  async getUserByEmail(email: string): Promise<UserAttributes | null> {
    const user = await this.model.findOne({ email }).exec()
    if (!user) {
      throw new ApiError({
        name: 'MODEL_NOT_FOUND_ERROR',
        message: 'No se encontró el Ususario',
        status: 400,
        code: 'ERR_MNF',
      })
    }
    return user
  }
}
