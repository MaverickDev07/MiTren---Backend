import User, { UserAttributes } from '../database/models/User'
import BaseRepository from './BaseRepository'

export default class UserRepository extends BaseRepository<UserAttributes> {
  protected allowedSortByFields = ['doc_type', 'role_name', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['email', 'name', 'lastname', 'doc_number']

  constructor() {
    super(User)
  }
}
