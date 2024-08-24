import CustomerType, { CustomerTypeAttributes } from '../database/models/CustomerType'
import BaseRepository from './BaseRepository'

export default class CustomerTypeRepository extends BaseRepository<CustomerTypeAttributes> {
  protected allowedSortByFields = ['customer_type']
  protected allowedFilterByFields = ['customer_type']

  constructor() {
    super(CustomerType)
  }
}
