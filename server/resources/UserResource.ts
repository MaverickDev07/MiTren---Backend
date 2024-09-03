import { UserAttributes, UserEntity } from '../database/models/User'
import BaseResource from './BaseResource'

class UserResource extends BaseResource<UserAttributes, UserEntity>() {
  item() {
    const userResource: UserEntity = {
      id: this.instance.id,
      email: this.instance.email,
      password: this.instance.password,
      name: this.instance.name,
      lastname: this.instance.lastname,
      doc_type: this.instance.doc_type,
      doc_number: this.instance.doc_number,
      address: this.instance.address,
      role_name: this.instance.role_name,
      status: this.instance.status,
    }

    return userResource
  }
}

export default UserResource
