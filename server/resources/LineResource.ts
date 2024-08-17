import { LineAttributes, LineEntity } from '../database/models/Line'
import BaseResource from './BaseResource'

class LineResource extends BaseResource<LineAttributes, LineEntity>() {
  item() {
    const lineResource: LineEntity = {
      id: this.instance.id,
      line_name: this.instance.line_name,
    }

    return lineResource
  }
}

export default LineResource
