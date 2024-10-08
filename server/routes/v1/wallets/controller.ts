import { Types } from 'mongoose'
import { NextFunction, Request, Response } from 'express'

import WalletResource from '../../../resources/WalletResource'
import WalletRepository from '../../../repositories/WalletRepository'

export const listWallets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new WalletRepository()
    const wallets = WalletResource.collection(
      await repository.getAll({
        sortBy: req.query.sort_by as string,
        filterBy: req.query.filter_by as string,
      }),
    )
    res.status(200).json({ wallets })
  } catch (error: any) {
    next(error)
  }
}

const generarNumeroAleatorio = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getPriceTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = {
      id: new Types.ObjectId().toHexString(),
      price: generarNumeroAleatorio(11, 49),
      currency: 'BOB',
      payment_methods: 'EFECTIVO',
      createdAt: new Date(),
    }

    res.status(200).json(data)
  } catch (error: any) {
    next(error)
  }
}

export const getWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new WalletRepository()
    const walletResource = new WalletResource(await repository.getById(req.params.id))
    res.status(200).json({ wallet: walletResource.item() })
  } catch (error: any) {
    next(error)
  }
}

export const createWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new WalletRepository()
    const walletResource = new WalletResource(await repository.create(req.body))
    const response = walletResource.item()
      ? { id: walletResource.item().id, code_response: 1 }
      : { code_response: 0 }

    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
}

export const updateWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new WalletRepository()
    const walletResource = new WalletResource(await repository.update(req.params.id, req.body))
    res.status(200).json({ wallet: walletResource.item() })
  } catch (error) {
    next(error)
  }
}

export const deleteWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new WalletRepository()
    await repository.delete(req.params.id)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}