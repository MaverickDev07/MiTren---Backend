import express, { Router } from 'express'
import { generateQR, verifyQrStatus } from './controller'
// import validateRequest from '../../../middlewares/validateRequest'

const veripagos: Router = express.Router()

veripagos.post('/generate', generateQR)
veripagos.post('/verify', verifyQrStatus)

export default veripagos
