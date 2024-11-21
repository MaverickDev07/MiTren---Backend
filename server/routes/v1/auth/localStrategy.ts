import { Strategy } from 'passport-local'
import boom from 'boom'

import UserResource from '../../../resources/UserResource'
import UserRepository from '../../../repositories/UserRepository'

const localStrategy = new Strategy(
  {
    session: false,
  },
  async function (username, password, done) {
    try {
      const repository = new UserRepository()
      const userFound = repository.getUserByEmail(username)

      if (!userFound) return done(boom.unauthorized('Usuario o Contraseña Incorrecto.'), false)

      const matchPassword = await repository.comparePassword(password, userFound?.password)

      if (!matchPassword) return done(boom.unauthorized('Usuario o Contraseña Incorrecto.'), false)

      return done(null, userFound)
    } catch (error) {
      return done(error)
    }
  },
)

export default localStrategy
