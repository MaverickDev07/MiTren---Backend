import { NfcTransactionAttributes, NfcTransactionEntity } from '../database/models/NfcTransaction'
import BaseResource from './BaseResource'

class NfcTransactionResource extends BaseResource<
  NfcTransactionAttributes,
  NfcTransactionEntity
>() {
  item() {
    const nfcTransactionResource: NfcTransactionEntity = {
      id: this.instance.id,
      customer_type: this.instance.customer_type,
      amount: this.instance.amount,
      date_time: this.instance.date_time,
      card_id: this.instance.card_id,
      method: this.instance.method,
    }

    return nfcTransactionResource
  }
}

export default NfcTransactionResource
