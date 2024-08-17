// Types for Errors
type ErrorName =
  | 'MODEL_NOT_FOUND_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'CONNECTION_ERROR'
  | 'METHOD_NOT_IMPLEMENTED'
  | 'FILTER_BY_ERROR'
  | 'REFERENCE_ERROR'

type ErrorCode =
  | 'ERR_MNF'
  | 'ERR_NF'
  | 'ERR_REMOTE'
  | 'NOT_IMPL'
  | 'ERR_VALID'
  | 'ERR_FTB'
  | 'ERR_REF'

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
