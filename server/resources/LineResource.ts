import BaseResource from './BaseResource'
import { LineAttributes } from '../utils/types'

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
