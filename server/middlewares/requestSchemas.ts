import Joi from 'joi'

// Line
export const createLineSchema = Joi.object({
  line_name: Joi.string().min(3).max(30).required(),
})

export const updateLineSchema = Joi.object({
  line_name: Joi.string().min(3).max(30),
}).or('line_name')

// Zone
export const createZoneSchema = Joi.object({
  zone_code: Joi.string().min(3).max(10).required(),
  zone_name: Joi.string().min(3).max(30).required(),
})

export const updateZoneSchema = Joi.object({
  zone_code: Joi.string().min(3).max(10).required(),
  zone_name: Joi.string().min(3).max(30).required(),
}).or('zone_code', 'zone_name')
