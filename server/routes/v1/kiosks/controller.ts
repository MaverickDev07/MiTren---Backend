import { NextFunction, Request, Response } from 'express'

import KioskResource from '../../../resources/KioskResource'
import KioskRepository from '../../../repositories/KioskRepository'

export const listKiosks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new KioskRepository()
    const kiosks = KioskResource.collection(
      await repository.getAll({
        sortBy: req.query.sort_by as string,
        filterBy: req.query.filter_by as string,
      }),
    )

    res.status(200).json({ kiosks })
  } catch (error) {
    next(error)
  }
}

export const getStationByKioskId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new KioskRepository()
    const kioskResource = new KioskResource(await repository.getStationByKioskId(req.params.id))
    res.status(200).json({ kiosk: kioskResource.item() })
  } catch (error: any) {
    next(error)
  }
}

export const getKiosk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new KioskRepository()
    const kioskResource = new KioskResource(await repository.getById(req.params.id))
    res.status(200).json({ kiosk: kioskResource.item() })
  } catch (error: any) {
    next(error)
  }
}

export const createKiosk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new KioskRepository()
    const kioskResource = new KioskResource(await repository.create(req.body))
    res.status(201).json({ kiosk: kioskResource.item() })
  } catch (error) {
    next(error)
  }
}

export const updateKiosk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new KioskRepository()
    const kioskResource = new KioskResource(await repository.update(req.params.id, req.body))
    res.status(200).json({ kiosk: kioskResource.item() })
  } catch (error) {
    next(error)
  }
}

export const deleteKiosk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new KioskRepository()
    await repository.delete(req.params.id)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
