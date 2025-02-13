/*
 * Copyright 2022 SoftCraft Incorporated. All rights reserved.
 * SPDX-License-Identifier: MIT
 * Name: Clem Onawole
 * Email: dapo.onawole@gmail.com
 */


'use strict'

import newrelicFormatter from '@newrelic/winston-enricher'
import express from 'express'
import newrelic from 'newrelic'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import winston, { format as _format, transports as _transports, createLogger, } from 'winston'
import status from 'http-status'
import errorHandler from './middleware/error.js'
import chalk from 'chalk'
import router from './routes/service.routes.js'
import * as dotenv from 'dotenv'

dotenv.config()
const { LOG_LEVEL, PORT, NODE_ENV } = process.env

const formatter = newrelicFormatter(winston)

const format = _format.combine(_format.label({ label: 'test' }), formatter())

const logger = createLogger({
    level: LOG_LEVEL || 'info',
    format: format,
    defaultMeta: { service: 'user-service' },
    transports: [
        NODE_ENV !== 'production' ? new winston.transports.Console() : undefined,
        //   (i.e., error, fatal, but not other levels)
        new _transports.File({ filename: '/tmp/error.log', level: 'error' }),
        //   (i.e., fatal, error, warn, and info, but not trace)
        new _transports.File({ filename: '/tmp/combined.log' }),
    ],
})


var app = express()

// middleware pipeline
app.use(cors())

// body Parser
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

// cookie parser
app.use(cookieParser())

// api call logger
app.use((req, res, next)=> {
    newrelic.setTransactionName(`${req.url}`)
    // logger.info(`api ${req.url} is being called.`)
    next()
    // logger.info(`api ${req.url} response is returned - ${res.statusCode}`)
})

app.use('/api/v1/', router)

// global error handler
app.use(errorHandler)

// not found - 404
app.use((req, res) => {
    logger.info(`api url not found - ${req.url}`)

    res.status(status.NOT_FOUND).json({ error: 'Not found' })
})

// start express server
const servicePort = PORT || 3000
app.listen(servicePort, () => {
    logger.info('service is being started')

    // eslint-disable-next-line no-console
    console.log(chalk.green(`-> Service API running at http://0.0.0.0:${servicePort}`))
})