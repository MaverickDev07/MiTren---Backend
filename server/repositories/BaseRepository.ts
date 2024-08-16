import mongoose, { Model, Document, FilterQuery, UpdateQuery, QueryOptions, Types } from 'mongoose'
import { parse } from 'liqe'

import ApiError from '../errors/ApiError'
import getMongooseWhereClause from '../utils/getMongooseWhereClause'

export default abstract class BaseRepository<T extends Document> {
  model: Model<T>
  protected allowedSortByFields: Array<string> = ['created_at']
  protected allowedFilterByFields: Array<string> = []

  constructor(model: Model<T>) {
    this.model = model
  }

  async getAll(options: Record<string, any> = {}): Promise<Array<T>> {
    const orderBy = this.getOrderBy(options.sortBy)
    delete options.sortBy
    options.sort = orderBy

    if (options.filterBy) {
      const filterBy = this.getFilterBy(options.filterBy)
      delete options.filterBy
      options.where = filterBy
    }

    return this.model
      .find(options.where || {})
      .sort(options.sort)
      .exec()
  }

  async getById(id: string | Types.ObjectId, options: QueryOptions = {}): Promise<T | null> {
    return this.model.findById(id, options).exec()
  }

  async create(body: Record<string, any>): Promise<T> {
    await this.validateReferences(body)
    return this.model.create(body)
  }

  async update(id: string | Types.ObjectId, body: UpdateQuery<T>): Promise<T | null> {
    await this.validateReferences(body)
    return this.model.findByIdAndUpdate(id, body, { new: true }).exec()
  }

  async delete(id: string | Types.ObjectId): Promise<T | null> {
    const instance = await this.model.findByIdAndDelete(id).exec() // Cambiamos a findByIdAndDelete para retornar el documento eliminado
    if (!instance) {
      throw new ApiError({
        name: 'NOT_FOUND_ERROR',
        message: 'Entity not found',
        status: 404,
        code: 'ERR_NF',
      })
    }
    return instance
  }

  protected getOrderBy(sortBy: string | undefined): Record<string, any> {
    const orderBy: Record<string, any> = { created_at: -1 } // Por defecto ordenado por 'created_at' descendente

    if (!sortBy) {
      return orderBy
    }

    const parts = sortBy.split('-')

    if (!this.allowedSortByFields.includes(parts[0])) {
      return orderBy
    }

    if (!parts[1] || !['asc', 'desc'].includes(parts[1].toLowerCase())) {
      return orderBy
    }

    return { [parts[0]]: parts[1].toLowerCase() === 'asc' ? 1 : -1 }
  }

  protected getFilterBy(filterBy: string): FilterQuery<T> {
    try {
      return getMongooseWhereClause(parse(filterBy), this.allowedFilterByFields)
    } catch (error: any) {
      throw new ApiError({
        name: 'FILTER_BY_ERROR',
        message: error.message,
        status: 400,
        code: 'ERR_FTB',
      })
    }
  }

  protected async validateReferences(body: Record<string, any>): Promise<void> {
    const idFields = Object.keys(body).filter(key => key.endsWith('_id'))

    for (const field of idFields) {
      const modelName = this.convertToCamelCase(field.replace('_id', ''))

      const model = this.getModelByName(modelName)

      if (!model) {
        throw new ApiError({
          name: 'MODEL_NOT_FOUND_ERROR',
          message: `Model ${modelName} not found`,
          status: 400,
          code: 'ERR_MNF',
        })
      }

      // Verificar si existe el documento referenciado
      const exists = await model.exists({ _id: body[field] })
      if (!exists) {
        throw new ApiError({
          name: 'REFERENCE_ERROR',
          message: `Referenced ${modelName} with id ${body[field]} not found`,
          status: 400,
          code: 'ERR_REF',
        })
      }
    }
  }

  protected convertToCamelCase(input: string): string {
    return input
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  protected getModelByName<T extends mongoose.Document>(modelName: string): Model<T> | undefined {
    return mongoose.models[modelName] as Model<T> | undefined
  }
}
