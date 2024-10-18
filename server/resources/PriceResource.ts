import { PriceAttributes, PriceEntity } from '../database/models/Price'
import BaseResource from './BaseResource'

export type StationPairPrices = {
  id?: string | any
  base_price: number
  customer_type: string
  customer_type_id: Schema.Types.ObjectId
  start_station: Station
  end_station: Station
  status?: string
  createdAt?: Date
  updatedAt?: Date
}

class PriceResource extends BaseResource<PriceAttributes, PriceEntity>() {
  item() {
    const priceResource: PriceEntity = {
      id: this.instance.id,
      base_price: this.instance.base_price,
      customer_type: this.instance.customer_type,
      customer_type_id: this.instance.customer_type_id,
      start_station: this.instance.start_station,
      end_station: this.instance.end_station,
      status: this.instance.status,
      createdAt: this.instance.createdAt,
      updatedAt: this.instance.updatedAt,
    }

    return priceResource
  }

  stationItemPrices() {
    const stationPricesResource: PriceEntity = {
      id: this.instance.id,
      base_price: this.instance.base_price,
      customer_type: this.instance.customer_type,
      customer_type_id: this.instance.customer_type_id,
      start_station: this.instance.start_station,
      end_station: this.instance.end_station,
      status: this.instance.status,
      createdAt: this.instance.createdAt,
      updatedAt: this.instance.updatedAt,
    }

    return stationPricesResource
  }
}

export default PriceResource
