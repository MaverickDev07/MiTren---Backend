import { TicketAttributes, TicketEntity } from '../database/models/Ticket'
import BaseResource from './BaseResource'

class TicketResource extends BaseResource<TicketAttributes, TicketEntity>() {
  item() {
    const ticketResource: TicketEntity = {
      id: this.instance.id,
      qr_code: this.instance.qr_code,
      date_time: this.instance.date_time,
      start_station: this.instance.start_station,
      end_station: this.instance.end_station,
      kiosk_id: this.instance.kiosk_id,
      method_name: this.instance.method_name,
      transfer: this.instance.transfer,
      promotion_title: this.instance.promotion_title,
      total_price: this.instance.total_price,
      route: this.instance.route,
    }

    return ticketResource
  }
}

export default TicketResource
