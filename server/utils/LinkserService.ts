import axios, { AxiosInstance } from 'axios'

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

class LinkserService {
  private apiClient: AxiosInstance

  constructor(
    private baseUrl: string,
    private auth: string,
  ) {
    this.apiClient = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    })
  }

  async generateQr(params: GenerateQrParams): Promise<GenerateQrResponse> {
    try {
      const response = await this.apiClient.post<GenerateQrResponse>('/bcp/generar-qr', params)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.Mensaje || 'Error generando QR')
    }
  }

  async verifyQrStatus(params: VerifyQrStatusParams): Promise<VerifyQrStatusResponse> {
    try {
      const response = await this.apiClient.post<VerifyQrStatusResponse>(
        '/bcp/verificar-estado-qr',
        params,
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.Mensaje || 'Error verificando estado del QR')
    }
  }
}

export default LinkserService
