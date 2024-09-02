import NfcTransaction, { NfcTransactionAttributes } from '../database/models/NfcTransaction'
import BaseRepository from './BaseRepository'

export default class NfcTransactionRepository extends BaseRepository<NfcTransactionAttributes> {
  protected allowedSortByFields = ['customer_type', 'date_time']
  protected allowedFilterByFields = ['customer_type']

  constructor() {
    super(NfcTransaction)
  }
}
