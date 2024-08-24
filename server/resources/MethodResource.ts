import { MethodAttributes, MethodEntity } from '../database/models/Method'
import BaseResource from './BaseResource'

class MethodResource extends BaseResource<MethodAttributes, MethodEntity>() {
  item() {
    const methodResource: MethodEntity = {
      id: this.instance.id,
      method_name: this.instance.method_name,
    }

    return methodResource
  }
}

export default MethodResource
