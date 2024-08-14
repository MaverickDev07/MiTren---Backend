import { NextFunction, Request, Response } from 'express'
import ZoneResource from '../../../resources/ZoneResource'
import ZoneRepository from '../../../repositories/ZoneRepository'

export const listZones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new ZoneRepository()
    const zones = ZoneResource.collection(
      await repository.getAll({
        sortBy: req.query.sort_by as string,
        filterBy: req.query.filter_by as string,
      }),
    )
    res.status(200).json({ zones })
  } catch (error: any) {
    next(error)
  }
}

export const getZone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new ZoneRepository()
    const zoneResource = new ZoneResource(await repository.getById(req.params.id))
    res.status(200).json({ zone: zoneResource.item() })
  } catch (error: any) {
    next(error)
  }
}

export const createZone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new ZoneRepository()
    const zoneResource = new ZoneResource(await repository.create(req.body))
    res.status(201).json({ zone: zoneResource.item() })
  } catch (error) {
    next(error)
  }
}

export const updateZone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new ZoneRepository()
    const zoneResource = new ZoneResource(await repository.update(req.params.id, req.body))
    res.status(200).json({ zone: zoneResource.item() })
  } catch (error) {
    next(error)
  }
}

export const deleteZone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new ZoneRepository()
    await repository.delete(req.params.id)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
