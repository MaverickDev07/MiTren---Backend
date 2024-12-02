import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import EnvManager from '../config/EnvManager'
import ApiError from '../errors/ApiError'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]

  try {
    if (!token || token === 'null')
      throw new ApiError({
        name: 'NO_TOKEN_PROVIDED',
        message: 'Authorization token is required.',
        code: 'ERR_NT',
        status: 401,
      })

    const decoded = jwt.verify(token, EnvManager.getAuthJwtSecret())
    req.user = decoded

    next()
  } catch (error) {
    return next(error)
  }
}

export const inRoles = (roles: [] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      /*req.body.user = {
        user_id,
        name,
        lastname,
        doc_type,
        doc_number,
      }*/
      console.log('middleware add user', roles)
      next()

      /*const user = await userServiceDB.findById(req.userId)
      const roles = await roleServiceDB.findByIds(user.roles)

      const accede = _roles.some(el => roles.find(role => role.name === el))

      if (accede) {
        return next()
      }

      throw new Error(`Require alguno de estos Roles: ${_roles.join(', ')}`)*/
    } catch (error) {
      return next(error)
    }
  }
}
