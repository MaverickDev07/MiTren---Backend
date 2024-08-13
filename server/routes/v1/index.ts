import express, { Router } from 'express'
import veripagos from './veripagos'

const v1: Router = express.Router()

v1.use('/qr/', veripagos)

export default v1
