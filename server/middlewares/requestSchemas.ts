/* eslint-disable max-lines */
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
  station_code: Joi.string().min(3).max(10).required(),
  station_name: Joi.string().min(3).max(50).required(),
  line_id: Joi.string().alphanum().hex().length(24).required(),
})

export const updateStationSchema = Joi.object({
  station_code: Joi.string().min(3).max(10),
  station_name: Joi.string().min(3).max(50),
  line_id: Joi.string().alphanum().hex().length(24),
}).or('station_code', 'station_name', 'line_id')

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
  start_stations: Joi.object({
    station_code: Joi.string().min(3).max(10).required(),
    station_name: Joi.string().min(3).max(50).required(),
  }).required(),
  end_stations: Joi.object({
    station_code: Joi.string().min(3).max(10).required(),
    station_name: Joi.string().min(3).max(50).required(),
  }).required(),
  prices: Joi.array()
    .min(1)
    .items(
      Joi.object({
        interstops: Joi.boolean(),
        customer_type: Joi.string().min(3).max(15).required(),
        base_price: Joi.number().min(1).required(),
      }),
    )
    .required(),
})

export const updateRouteSchema = Joi.object({
  route_code: Joi.string().min(3).max(10),
  start_stations: Joi.object({
    station_code: Joi.string().min(3).max(10).required(),
    station_name: Joi.string().min(3).max(50).required(),
  }),
  end_stations: Joi.object({
    station_code: Joi.string().min(3).max(10).required(),
    station_name: Joi.string().min(3).max(50).required(),
  }),
  prices: Joi.array()
    .min(1)
    .items(
      Joi.object({
        interstops: Joi.boolean(),
        customer_type: Joi.string().min(3).max(15),
        base_price: Joi.number().min(1),
      }),
    ),
}).or('route_code', 'stations', 'prices')

export const createRouteStationRangeSchema = Joi.object({
  start_code: Joi.string().min(3).max(10).required(),
  end_code: Joi.string().min(3).max(10).required(),
  prices: Joi.array()
    .min(1)
    .items(
      Joi.object({
        interstops: Joi.boolean(),
        customer_type: Joi.string().min(3).max(15).required(),
        base_price: Joi.number().min(1).required(),
      }),
    )
    .required(),
})

// Method
export const createMethodSchema = Joi.object({
  method_name: Joi.string().min(3).max(30).required(),
})

export const updateMethodSchema = Joi.object({
  method_name: Joi.string().min(3).max(30),
}).or('method_name')

// CustomerType
export const createCustomerTypeSchema = Joi.object({
  customer_type: Joi.string().min(3).max(30).required(),
})

export const updateCustomerTypeSchema = Joi.object({
  customer_type: Joi.string().min(3).max(30),
}).or('customer_type')

// Customer
export const createCustomerSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  name: Joi.string().min(3).max(30).required(),
  lastname: Joi.string().min(3).max(30).required(),
  doc_type: Joi.string().min(3).max(30).required(),
  doc_number: Joi.string().min(3).max(30).required(),
  status: Joi.string().min(3).max(10).required(),
  type: Joi.object({
    type_id: Joi.string().alphanum().hex().length(24).required(),
    customer_type: Joi.string().min(3).max(30).required(),
  }).required(),
})

export const updateCustomerSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  name: Joi.string().min(3).max(30),
  lastname: Joi.string().min(3).max(30),
  doc_type: Joi.string().min(3).max(30),
  doc_number: Joi.string().min(3).max(30),
  status: Joi.string().min(3).max(10),
  type: Joi.object({
    type_id: Joi.string().alphanum().hex().length(24),
    customer_type: Joi.string().min(3).max(30),
  }),
})
