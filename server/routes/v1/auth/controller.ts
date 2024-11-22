import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

export const authUser = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (error: any, user: any) => {
    if (error) return next(error)

    req.login(user, { session: false }, async error => {
      if (error) return next(error)
      const data = { message: 'test' }

      /*const payload = {
        _id: user['_id'],
        username: user['username'],
        email: user['email'],
      }
      const token = jwt.sign(payload, config.authJwtSecret, {
        expiresIn: config.authJwtTime,
      })
      const roles = user['roles'].map(el => el.name)
      const data = {
        _id: user['_id'],
        username: user['username'],
        email: user['email'],
        carnet: user['carnet'],
        roles,
        niveles: user['niveles'],
      }

      res.setHeader('Authorization', `Bearer ${token}`)*/
      return res.status(200).json({
        message: 'signin successfully',
        data,
      })
    })
  })(req, res, next)
}
