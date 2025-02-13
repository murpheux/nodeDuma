'use strict'

import express from 'express'
import asyncHandler from '../middleware/async.js'
import { ServiceController } from '../controllers/service.js'

const router = express.Router()

const api = new ServiceController()

router.get('/', asyncHandler(api.alive))
router.get('/ping', asyncHandler(api.ping))
router.get('/health', asyncHandler(api.health))
router.get('/getnames', asyncHandler(api.getnames))
router.get('/senderr', asyncHandler(api.senderr))
router.get('/rthrow', asyncHandler(api.rthrow))
router.get('/caller', asyncHandler(api.caller))

router.post('/schedule', asyncHandler(api.addschedule))
router.post('/student', asyncHandler(api.addstudent))


export default router