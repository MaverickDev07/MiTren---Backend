import User, { UserAttributes } from '../database/models/User'
import BaseRepository from './BaseRepository'

export default class UserRepository extends BaseRepository<UserAttributes> {
  protected allowedSortByFields = ['lastname', 'doc_type', 'role_name', 'status']
  protected allowedFilterByFields = ['email', 'name', 'lastname', 'doc_number']

  constructor() {
    super(User)
  }
}
