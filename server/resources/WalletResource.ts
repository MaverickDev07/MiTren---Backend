import { WalletAttributes, WalletEntity } from '../database/models/Wallet'
import BaseResource from './BaseResource'

class WalletResource extends BaseResource<WalletAttributes, WalletEntity>() {
  item() {
    const walletResource: WalletEntity = {
      id: this.instance.id,
      price: this.instance.price,
      currency: this.instance.currency,
      amount_paid: this.instance.amount_paid,
      cash_back: this.instance.cash_back,
      summary: this.instance.summary,
      status: this.instance.status,
    }

    return walletResource
  }
}

export default WalletResource
