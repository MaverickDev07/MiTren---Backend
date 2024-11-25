import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { UserAttributes } from '../../../database/models/User'
import EnvManager from '../../../config/EnvManager'

export const authUser = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (error: Error, user: UserAttributes) => {
    if (error) return next(error)

    req.login(user, { session: false }, async error => {
      if (error) return next(error)

      const payload = {
        id: user.id,
        full_name: `${user.lastname} ${user.name}`,
        email: user.email,
        role: user.role_name,
      }
      const authJwtSecret = EnvManager.getAuthJwtSecret()
      const authJwtTime = EnvManager.getAuthJwtTime()
      const token = jwt.sign(payload, authJwtSecret, {
        expiresIn: authJwtTime,
      })
      const data = {
        id: user.id,
        name: user.name,
        latname: user.lastname,
        email: user.email,
        role_name: user.role_name,
      }

      res.setHeader('Authorization', `Bearer ${token}`)

      return res.status(200).json({
        message: 'signin successfully',
        data,
      })
    })
  })(req, res, next)
}
