import { NextFunction, Request, Response } from 'express'
import LineResource from '../../../resources/LineResource'
import LineRepository from '../../../repositories/LineRepository'

export const listLines = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new LineRepository()
    const lines = LineResource.collection(
      await repository.getAll({
        sortBy: req.query.sort_by as string,
        filterBy: req.query.filter_by as string,
      }),
    )
    res.status(200).json({ lines })
  } catch (error: any) {
    next(error)
  }
}

export const getLine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new LineRepository()
    const lineResource = new LineResource(await repository.getById(req.params.id))
    res.status(200).json({ line: lineResource.item() })
  } catch (error: any) {
    next(error)
  }
}

export const createLine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new LineRepository()
    const lineResource = new LineResource(await repository.create(req.body))
    res.status(201).json({ line: lineResource.item() })
  } catch (error) {
    next(error)
  }
}

export const updateLine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new LineRepository()
    const lineResource = new LineResource(await repository.update(req.params.id, req.body))
    res.status(200).json({ line: lineResource.item() })
  } catch (error) {
    next(error)
  }
}

export const deleteLine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new LineRepository()
    await repository.delete(req.params.id)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
