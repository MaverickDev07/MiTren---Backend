import express, { Router } from 'express'
import veripagos from './veripagos'
import lines from './lines'
import zones from './zones'
import stations from './stations'
import kiosks from './kiosks'
import routes from './routes'

const v1: Router = express.Router()

v1.use('/qr', veripagos)
v1.use('/lines', lines)
v1.use('/zones', zones)
v1.use('/stations', stations)
v1.use('/kiosks', kiosks)
v1.use('/routes', routes)

export default v1
