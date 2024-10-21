/* eslint-disable max-lines */
import Joi from 'joi'

// Line
export const createLineSchema = Joi.object({
  line_name: Joi.string().min(3).max(30).required(),
  color: Joi.string().min(3).max(9).required(),
  status: Joi.string().min(3).max(10),
})

export const updateLineSchema = Joi.object({
  line_name: Joi.string().min(3).max(30),
  color: Joi.string().min(3).max(9),
  status: Joi.string().min(3).max(10),
}).or('line_name', 'color', 'status')

// Station
export const createStationSchema = Joi.object({
  station_name: Joi.string().min(3).max(70).required(),
  line_id: Joi.array().min(1).items(Joi.string().alphanum().hex().length(24)).required(),
  is_transfer_stop: Joi.boolean(),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
  status: Joi.string().min(3).max(10),
})

export const updateStationSchema = Joi.object({
  station_name: Joi.string().min(3).max(70),
  line_id: Joi.array().min(1).items(Joi.string().alphanum().hex().length(24)),
  is_transfer_stop: Joi.boolean(),
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number(),
  }),
  status: Joi.string().min(3).max(10),
}).or('station_name', 'line_id', 'is_transfer_stop', 'location', 'status')

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
  line_id: Joi.string().alphanum().hex().length(24).required(),
  stations: Joi.array()
    .min(2)
    .items(
      Joi.object({
        station_id: Joi.string().alphanum().hex().length(24).required(),
        station_name: Joi.string().min(3).max(50).required(),
      }),
    )
    .required(),
})

export const updateRouteSchema = Joi.object({
  line_id: Joi.string().alphanum().hex().length(24),
  stations: Joi.array()
    .min(2)
    .items(
      Joi.object({
        station_id: Joi.string().alphanum().hex().length(24),
        station_name: Joi.string().min(3).max(50),
      }),
    ),
}).or('line_id', 'stations')

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
  name: Joi.string().min(3).max(50).required(),
  lastname: Joi.string().min(3).max(50).required(),
  doc_type: Joi.string().min(3).max(20).required(),
  doc_number: Joi.string().min(6).max(15).required(),
  status: Joi.string().min(3).max(10),
  type: Joi.object({
    type_id: Joi.string().alphanum().hex().length(24).required(),
    customer_type: Joi.string().min(3).max(30).required(),
  }).required(),
})

export const updateCustomerSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  name: Joi.string().min(3).max(50),
  lastname: Joi.string().min(3).max(50),
  doc_type: Joi.string().min(3).max(20),
  doc_number: Joi.string().min(6).max(15),
  status: Joi.string().min(3).max(10),
  type: Joi.object({
    type_id: Joi.string().alphanum().hex().length(24),
    customer_type: Joi.string().min(3).max(30),
  }),
})

// Card NFC
export const createNfcCardSchema = Joi.object({
  card_code: Joi.string().min(3).max(10).required(),
  balance: Joi.number().min(1).required(),
  issue_date: Joi.date(),
  status: Joi.string().min(3).max(10),
  user: Joi.object({
    user_id: Joi.string().alphanum().hex().length(24).required(),
    name: Joi.string().min(3).max(50).required(),
    lastname: Joi.string().min(3).max(50).required(),
    doc_type: Joi.string().min(3).max(20).required(),
    doc_number: Joi.string().min(6).max(15).required(),
  }).required(),
  customer: Joi.object({
    customer_id: Joi.string().alphanum().hex().length(24).required(),
    name: Joi.string().min(3).max(50).required(),
    lastname: Joi.string().min(3).max(50).required(),
    doc_type: Joi.string().min(3).max(20).required(),
    doc_number: Joi.string().min(6).max(15).required(),
  }).required(),
})

export const updateNfcCardSchema = Joi.object({
  card_code: Joi.string().min(3).max(10),
  balance: Joi.number().min(1),
  issue_date: Joi.date(),
  status: Joi.string().min(3).max(10),
  user: Joi.object({
    user_id: Joi.string().alphanum().hex().length(24),
    name: Joi.string().min(3).max(50),
    lastname: Joi.string().min(3).max(50),
    doc_type: Joi.string().min(3).max(20),
    doc_number: Joi.string().min(6).max(15),
  }),
  customer: Joi.object({
    customer_id: Joi.string().alphanum().hex().length(24),
    name: Joi.string().min(3).max(50),
    lastname: Joi.string().min(3).max(50),
    doc_type: Joi.string().min(3).max(20),
    doc_number: Joi.string().min(6).max(15),
  }),
})

// Transaction NFC
export const createNfcTransactionSchema = Joi.object({
  customer_type: Joi.string().min(3).max(30).required(),
  amount: Joi.number().min(1).required(),
  card_id: Joi.string().alphanum().hex().length(24).required(),
  method: Joi.object({
    method_id: Joi.string().alphanum().hex().length(24).required(),
    method_name: Joi.string().min(3).max(30).required(),
  }).required(),
})

export const updateNfcTransactionSchema = Joi.object({
  customer_type: Joi.string().min(3).max(30),
  amount: Joi.number().min(1),
  card_id: Joi.string().alphanum().hex().length(24),
  method: Joi.object({
    method_id: Joi.string().alphanum().hex().length(24),
    method_name: Joi.string().min(3).max(30),
  }),
})

// Promotion
export const createPromotionSchema = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(3).max(150).required(),
  discount: Joi.number().min(10).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
})

export const updatePromotionSchema = Joi.object({
  title: Joi.string().min(3).max(30),
  description: Joi.string().min(3).max(150),
  discount: Joi.number().min(10),
  start_date: Joi.date(),
  end_date: Joi.date(),
})

// User
export const createUserSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  password: Joi.string().min(8).max(30).required(),
  name: Joi.string().min(3).max(50).required(),
  lastname: Joi.string().min(3).max(50).required(),
  doc_type: Joi.string().min(3).max(20).required(),
  doc_number: Joi.string().min(6).max(15).required(),
  address: Joi.string().min(3).max(50).required(),
  role_name: Joi.string().min(3).max(10).required(),
  status: Joi.string().min(3).max(10).required(),
})

export const updateUserSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  name: Joi.string().min(3).max(50),
  lastname: Joi.string().min(3).max(50),
  doc_type: Joi.string().min(3).max(20),
  doc_number: Joi.string().min(6).max(15),
  address: Joi.string().min(3).max(50),
  role_name: Joi.string().min(3).max(10),
  status: Joi.string().min(3).max(10),
})

// Price
export const createPriceSchema = Joi.object({
  base_price: Joi.number().min(0.1).required(),
  customer_type: Joi.string().min(3).max(15).required(),
  customer_type_id: Joi.string().alphanum().hex().length(24).required(),
  start_station: Joi.object({
    station_id: Joi.string().alphanum().hex().length(24).required(),
    station_name: Joi.string().min(3).max(50).required(),
  }),
  end_station: Joi.object({
    station_id: Joi.string().alphanum().hex().length(24).required(),
    station_name: Joi.string().min(3).max(50).required(),
  }),
})

export const updatePriceSchema = Joi.object({
  base_price: Joi.number().min(0.1),
  customer_type: Joi.string().min(3).max(15),
  customer_type_id: Joi.string().alphanum().hex().length(24),
  start_stations: Joi.object({
    station_id: Joi.string().alphanum().hex().length(24),
    station_name: Joi.string().min(3).max(50),
  }),
  end_stations: Joi.object({
    station_id: Joi.string().alphanum().hex().length(24),
    station_name: Joi.string().min(3).max(50),
  }),
})

// Ticket
export const createTicketSchema = Joi.object({
  start_station: Joi.string().min(3).max(50).required(),
  end_station: Joi.string().min(3).max(50).required(),
  kiosk_id: Joi.string().alphanum().hex().length(24).required(),
  method_name: Joi.string().min(2).max(15).required(),
  id_qr: Joi.string().min(2).max(20),
  is_transfer: Joi.boolean(),
  promotion_title: Joi.string().min(3).max(30),
  total_price: Joi.number().min(0.1).required(),
  route: Joi.object({
    line_name: Joi.string().min(3).max(30).required(),
    stations: Joi.array().min(2).items(Joi.string().min(3).max(50)).required(),
    prices: Joi.array()
      .min(1)
      .items(
        Joi.object({
          qty: Joi.number().min(1).required(),
          customer_type: Joi.string().min(3).max(15).required(),
          base_price: Joi.number().min(1).required(),
        }),
      )
      .required(),
  }).required(),
})

export const updateTicketSchema = Joi.object({
  start_station: Joi.string().min(3).max(50),
  end_station: Joi.string().min(3).max(50),
  kiosk_id: Joi.string().alphanum().hex().length(24),
  method_name: Joi.string().min(3).max(30),
  id_qr: Joi.string().min(2).max(20),
  is_transfer: Joi.boolean(),
  promotion_title: Joi.string().min(3).max(30),
  route: Joi.object({
    line_name: Joi.string().min(3).max(30).required(),
    stations: Joi.array().min(2).items(Joi.string().min(3).max(50)),
    prices: Joi.array()
      .min(1)
      .items(
        Joi.object({
          qty: Joi.number().min(1),
          customer_type: Joi.string().min(3).max(15),
          base_price: Joi.number().min(1),
        }),
      ),
  }),
})

// Wallet
export const createWalletSchema = Joi.object({
  code: Joi.string().alphanum().hex().length(24),
  price: Joi.number().min(0.5).required(),
  currency: Joi.string().min(2).max(3).required(),
  amount_paid: Joi.number().min(1).required(),
  cash_back: Joi.number().min(0.5).required(),
  payment_methods: Joi.string().min(3).max(15).required(),
  created_on: Joi.date(),
  status: Joi.string().min(3).max(15),
  summary: Joi.string().min(0).max(50),
})

export const updateWalletSchema = Joi.object({
  status: Joi.string().min(3).max(15).required(),
  summary: Joi.string().min(0).max(50),
}).or('status', 'summary')
