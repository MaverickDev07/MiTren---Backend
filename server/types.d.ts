// Types for Errors
type ErrorName =
  | 'NOT_FOUND_ERROR'
  | 'CONNECTION_ERROR'
  | 'METHOD_NOT_IMPLEMENTED'
  | 'FILTER_BY_ERROR'
type ErrorCode = 'ERR_NF' | 'ERR_REMOTE' | 'NOT_IMPL' | 'ERR_VALID' | 'ERR_FTB'

type ValidationError = {
  error: {
    message: string
    code: ErrorCode
    errors: Array<{ message: string }>
  }
}

// Interface for Veripagos
interface GenerateQrParams {
  secret_key: string
  monto: number
  data?: any[]
  vigencia?: string
  uso_unico?: boolean
  detalle?: string
}

interface VerifyQrStatusParams {
  secret_key: string
  movimiento_id: string
}

interface GenerateQrResponse {
  Codigo: number
  Data: {
    movimiento_id: number
    qr: string
  }
  Mensaje: string
}

interface VerifyQrStatusResponse {
  Codigo: number
  Data: {
    movimiento_id: number
    monto: number
    detalle: string
    estado: string
    estado_notificacion: string
    remitente: {
      nombre: string
      banco: string
      documento: string
      cuenta: string
    }
  } | null
  Mensaje: string
}

// Types for Entities
type LineEntity = {
  id: string
  line_name: string
}
type ZoneEntity = {
  id: string
  zone_code: string
  zone_name: string
}
