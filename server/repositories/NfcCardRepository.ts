import NfcCard, { NfcCardAttributes } from '../database/models/NfcCard'
import BaseRepository from './BaseRepository'

export default class NfcCardRepository extends BaseRepository<NfcCardAttributes> {
  protected allowedSortByFields = ['card_code', 'issue_date', 'status', 'createdAt', 'updatedAt']
  protected allowedFilterByFields = ['card_code', 'user', 'issue_date']

  constructor() {
    super(NfcCard)
  }
}
