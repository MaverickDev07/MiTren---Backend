import { NextFunction, Request, Response } from 'express'
import CustomerTypeResource from '../../../resources/CustomerTypeResource'
import CustomerTypeRepository from '../../../repositories/CustomerTypeRepository'

export const listCustomerTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new CustomerTypeRepository()
    const customerTypes = CustomerTypeResource.collection(
      await repository.getAll({
        sortBy: req.query.sort_by as string,
        filterBy: req.query.filter_by as string,
      }),
    )
    res.status(200).json({ customerTypes })
  } catch (error: any) {
    next(error)
  }
}

export const getCustomerType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new CustomerTypeRepository()
    const customerTypeResource = new CustomerTypeResource(await repository.getById(req.params.id))
    res.status(200).json({ customerType: customerTypeResource.item() })
  } catch (error: any) {
    next(error)
  }
}

export const createCustomerType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new CustomerTypeRepository()
    const customerTypeResource = new CustomerTypeResource(await repository.create(req.body))
    res.status(201).json({ customerType: customerTypeResource.item() })
  } catch (error) {
    next(error)
  }
}

export const updateCustomerType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new CustomerTypeRepository()
    const customerTypeResource = new CustomerTypeResource(
      await repository.update(req.params.id, req.body),
    )
    res.status(200).json({ customerType: customerTypeResource.item() })
  } catch (error) {
    next(error)
  }
}

export const deleteCustomerType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new CustomerTypeRepository()
    await repository.delete(req.params.id)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
