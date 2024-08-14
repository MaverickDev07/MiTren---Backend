import express, { Router } from 'express'
import veripagos from './veripagos'
import lines from './lines'
import zones from './zones'

const v1: Router = express.Router()

v1.use('/qr', veripagos)
v1.use('/lines', lines)
v1.use('/zones', zones)

export default v1
