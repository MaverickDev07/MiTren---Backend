import { NfcCardAttributes, NfcCardEntity } from '../database/models/NfcCard'
import BaseResource from './BaseResource'

class NfcCardResource extends BaseResource<NfcCardAttributes, NfcCardEntity>() {
  item() {
    const nfcCardResource: NfcCardEntity = {
      id: this.instance.id,
      card_code: this.instance.card_code,
      balance: this.instance.balance,
      issue_date: this.instance.issue_date,
      status: this.instance.status,
      user: this.instance.user,
      customer: this.instance.customer,
    }

    return nfcCardResource
  }
}

export default NfcCardResource
