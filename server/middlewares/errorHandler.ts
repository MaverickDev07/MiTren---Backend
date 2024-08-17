import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

import ApiError from '../errors/ApiError'

/* eslint-disable max-params */
export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(error)
  }

  if (Joi.isError(error)) {
    const validationError: ValidationError = {
      error: {
        message: 'Validation error',
        code: 'ERR_VALID',
        errors: error.details.map(item => ({
          message: item.message,
        })),
      },
    }
    return res.status(423).json(validationError)
  }

  if (error instanceof ApiError) {
    return res.status(error.status).json({
      error: {
        message: error.message,
        code: error.code,
      },
    })
  }

  if (process.env.NODE_ENV === 'development') {
    // Manejo para otros tipos de errores
    return res.status(500).json({
      error: {
        code: 'ERR_UNKNOWN',
        message: error.message,
        stack: error.stack, // Incluye el stack trace para facilitar la depuración
      },
    })
  } else {
    if (process.env.NODE_ENV !== 'test') {
      console.log(error)
    }

    res.status(500).json({
      error: {
        code: 'ERR_UNKNOWN',
        message: error.message || 'An error occurred. Please view logs for more details',
      },
    })
  }
}
/* eslint-enable max-params */
