import Method, { MethodAttributes } from '../database/models/Method'
import BaseRepository from './BaseRepository'

export default class MethodRepository extends BaseRepository<MethodAttributes> {
  protected allowedSortByFields = ['method_name']
  protected allowedFilterByFields = ['method_name']

  constructor() {
    super(Method)
  }
}
