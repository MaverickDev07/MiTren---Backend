import { PriceAttributes, PriceEntity } from '../database/models/Price'
import BaseResource from './BaseResource'

class PriceResource extends BaseResource<PriceAttributes, PriceEntity>() {
  item() {
    const priceResource: PriceEntity = {
      id: this.instance.id,
      base_price: this.instance.base_price,
      customer_type: this.instance.customer_type,
      customer_type_id: this.instance.customer_type_id,
      start_station: this.instance.start_station,
      end_station: this.instance.end_station,
    }

    return priceResource
  }
}

export default PriceResource
