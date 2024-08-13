export type ErrorName =
  | 'NOT_FOUND_ERROR'
  | 'CONNECTION_ERROR'
  | 'METHOD_NOT_IMPLEMENTED'
  | 'FILTER_BY_ERROR'
export type ErrorCode = 'ERR_NF' | 'ERR_REMOTE' | 'NOT_IMPL' | 'ERR_VALID' | 'ERR_FTB'

export type ValidationError = {
  error: {
    message: string
    code: ErrorCode
    errors: Array<{ message: string }>
  }
}

// Types Models
export type LineAttributes = {
  line_name: string
  created_at: Date
  updated_at: Date
}
