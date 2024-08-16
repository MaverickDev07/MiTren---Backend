import { NextFunction, Request, Response } from 'express'

import StationResource from '../../../resources/StationResource'
import StationRepository from '../../../repositories/StationRepository'

export const listStations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new StationRepository()
    const stations = StationResource.collection(
      await repository.getAll({
        sortBy: req.query.sort_by as string,
        filterBy: req.query.filter_by as string,
      }),
    )

    res.status(200).json({ stations })
  } catch (error) {
    next(error)
  }
}

export const getStation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new StationRepository()
    const stationResource = new StationResource(await repository.getById(req.params.id))
    res.status(200).json({ station: stationResource.item() })
  } catch (error: any) {
    next(error)
  }
}

export const createStation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new StationRepository()
    const stationResource = new StationResource(await repository.create(req.body))
    res.status(201).json({ station: stationResource.item() })
  } catch (error) {
    next(error)
  }
}

export const updateStation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new StationRepository()
    const stationResource = new StationResource(await repository.update(req.params.id, req.body))
    res.status(200).json({ station: stationResource.item() })
  } catch (error) {
    next(error)
  }
}

export const deleteStation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new StationRepository()
    await repository.delete(req.params.id)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
