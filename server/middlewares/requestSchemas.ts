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
  lines: Joi.array().items(Joi.string().alphanum().hex().length(24)).required(),
})

export const updateZoneSchema = Joi.object({
  zone_code: Joi.string().min(3).max(10),
  zone_name: Joi.string().min(3).max(30),
  lines: Joi.array().items(Joi.string().alphanum().hex().length(24)),
}).or('zone_code', 'zone_name', 'lines')

// Station
export const createStationSchema = Joi.object({
  station_name: Joi.string().min(3).max(50).required(),
  zone_id: Joi.string().alphanum().hex().length(24).required(),
})

export const updateStationSchema = Joi.object({
  station_name: Joi.string().min(3).max(50),
  zone_id: Joi.string().alphanum().hex().length(24),
}).or('station_name', 'zone_id')

// Kiosk
export const createKioskSchema = Joi.object({
  kiosk_code: Joi.string().min(3).max(10).required(),
  station_id: Joi.string().alphanum().hex().length(24).required(),
})

export const updateKioskSchema = Joi.object({
  kiosk_code: Joi.string().min(3).max(10),
  station_id: Joi.string().alphanum().hex().length(24),
}).or('kiosk_code', 'station_id')

// Route
export const createRouteSchema = Joi.object({
  route_code: Joi.string().min(3).max(10).required(),
  stations: Joi.array().items(
    Joi.object({
      station_code: Joi.string().min(3).max(10).required(),
      station_name: Joi.string().min(3).max(50).required(),
    }),
  ),
  prices: Joi.array().items(
    Joi.object({
      interstops: Joi.boolean(),
      customer_type: Joi.string().min(3).max(15).required(),
      base_price: Joi.number().min(1),
    }),
  ),
})

export const updateRouteSchema = Joi.object({
  route_code: Joi.string().min(3).max(10),
}).or('route_code', 'stations', 'prices')
