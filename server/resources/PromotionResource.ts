import { PromotionAttributes, PromotionEntity } from '../database/models/Promotion'
import BaseResource from './BaseResource'

class PromotionResource extends BaseResource<PromotionAttributes, PromotionEntity>() {
  item() {
    const promotionResource: PromotionEntity = {
      id: this.instance.id,
      title: this.instance.title,
      description: this.instance.description,
      discount: this.instance.discount,
      start_date: this.instance.start_date,
      end_date: this.instance.end_date,
      active: this.instance.active,
    }

    return promotionResource
  }
}

export default PromotionResource
