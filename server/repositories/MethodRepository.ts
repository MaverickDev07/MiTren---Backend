import Method, { MethodAttributes } from '../database/models/Method'
import BaseRepository from './BaseRepository'

export default class MethodRepository extends BaseRepository<MethodAttributes> {
  protected allowedSortByFields = ['method_name', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['method_name']

  constructor() {
    super(Method)
  }
}
