import { Document } from 'mongoose'
import { PriceAttributes, PriceEntity } from '../database/models/Price'
import BaseResource from './BaseResource'

type Price = {
  customer_type: string
  base_price: number
}
type StartPoint = {
  start_station: string
  start_line: string
}
type EndPoint = {
  end_station: string
  end_line: string
}
type TransferPoint = {
  is_transfer: boolean
  transfer_station: string
}

export type StationPairPrices = {
  prices: Array<Price>
  start_point: StartPoint
  end_point: EndPoint
  transfer_point: TransferPoint
}

export interface StationPairPricesAttributes extends StationPairPrices, Document {}

export class StationPairPricesResource extends BaseResource<
  StationPairPricesAttributes,
  StationPairPrices
>() {
  /* eslint-disable-next-line max-params */
  buildStationPairPrices(
    prices: Price[],
    start_station: string,
    start_line: string,
    end_station: string,
    end_line: string,
    is_transfer: boolean,
    transfer_station: string,
  ): StationPairPrices {
    return {
      prices,
      start_point: {
        start_station,
        start_line,
      },
      end_point: {
        end_station,
        end_line,
      },
      transfer_point: {
        is_transfer,
        transfer_station,
      },
    }
  }

  stationItemPrices() {
    const stationPairPricesResource: StationPairPrices = {
      prices: this.instance.prices,
      start_point: this.instance.start_point,
      end_point: this.instance.end_point,
      transfer_point: this.instance.transfer_point,
    }

    return stationPairPricesResource
  }
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
}

export default PriceResource
