import Promotion, { PromotionAttributes } from '../database/models/Promotion'
import BaseRepository from './BaseRepository'

export default class PromotionRepository extends BaseRepository<PromotionAttributes> {
  protected allowedSortByFields = [
    'title',
    'discount',
    'start_date',
    'end_date',
    'active',
    'status',
    'createdAt',
    'updatedAt',
  ]
  protected allowedFilterByFields = ['title', 'discount']

  constructor() {
    super(Promotion)
  }
}
