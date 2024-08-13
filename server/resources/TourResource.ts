import BaseResource from './BaseResource'

class LineResource extends BaseResource<LineAttributes, LineEntity>() {
  item() {
    const lineResource: LineEntity = {
      id: this.instance.id,
      line_name: this.instance.name,
    }

    return lineResource
  }
}

export default LineResource
