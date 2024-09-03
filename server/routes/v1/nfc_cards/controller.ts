import { NextFunction, Request, Response } from 'express'
import NfcCardResource from '../../../resources/NfcCardResource'
import NfcCardRepository from '../../../repositories/NfcCardRepository'

export const listNfcCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new NfcCardRepository()
    const nfcCards = NfcCardResource.collection(
      await repository.getAll({
        sortBy: req.query.sort_by as string,
        filterBy: req.query.filter_by as string,
      }),
    )
    res.status(200).json({ nfcCards })
  } catch (error: any) {
    next(error)
  }
}

export const getNfcCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new NfcCardRepository()
    const nfcCardResource = new NfcCardResource(await repository.getById(req.params.id))
    res.status(200).json({ nfcCard: nfcCardResource.item() })
  } catch (error: any) {
    next(error)
  }
}

export const createNfcCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new NfcCardRepository()
    const nfcCardResource = new NfcCardResource(await repository.create(req.body))
    res.status(201).json({ nfcCard: nfcCardResource.item() })
  } catch (error) {
    next(error)
  }
}

export const updateNfcCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new NfcCardRepository()
    const nfcCardResource = new NfcCardResource(await repository.update(req.params.id, req.body))
    res.status(200).json({ nfcCard: nfcCardResource.item() })
  } catch (error) {
    next(error)
  }
}

export const deleteNfcCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new NfcCardRepository()
    await repository.delete(req.params.id)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
