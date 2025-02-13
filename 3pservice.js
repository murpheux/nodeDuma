/*
 * Copyright 2022 SoftCraft Incorporated. All rights reserved.
 * SPDX-License-Identifier: MIT
 * Name: Clem Onawole
 * Email: dapo.onawole@gmail.com
 */


import newrelicFormatter from '@newrelic/winston-enricher'
import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import status from 'http-status'
import newrelic from 'newrelic'
import winston, { format as _format, transports as _transports, createLogger, } from 'winston'
import connectDatabase from './data/dbaccess.js'
import Schedule from './models/schedule.js'
import Student from './models/student.js'
import errorHandler from './middleware/error.js'

dotenv.config()
const { LOG_LEVEL, NODE_ENV } = process.env

const formatter = newrelicFormatter(winston)

const format = _format.combine(_format.label({ label: 'test' }), formatter())

const logger = createLogger({
    level: LOG_LEVEL || 'info',
    format: format,
    defaultMeta: { service: 'user-service' },
    transports: [
        NODE_ENV !== 'production' ? new _transports.Console() : undefined,
        //   (i.e., error, fatal, but not other levels)
        new _transports.File({ filename: '/tmp/error.log', level: 'error' }),
        //   (i.e., fatal, error, warn, and info, but not trace)
        new _transports.File({ filename: '/tmp/combined.log' }),
    ],
})


const app = express()
const PORT = 8082

// middleware pipeline
app.use(cors())

// body Parser
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

// cookie parser
app.use(cookieParser())

// newrelic transaction
app.use((req, res, next)=> {
    newrelic.setTransactionName(`${req.url}`)
    next()
})

// db connection 
await connectDatabase()

// Simulate intermittent failures
app.get('/unstable', async (_req, res) => {
    const randomFail = Math.random() < 0.5 // 50% chance of failure
    const randomDelay = Math.floor(Math.random() * 4000) // Up to 4 seconds delay

    if (randomFail) {
        return res
            .status(500)
            .json({ error: 'Intermittent server error' })
    } else {
        setTimeout(() => {
            res.json({
                message: 'Request succeeded after delay',
            })
        }, randomDelay)
    }
})

let index = 1

app.get('/retry', async (_req, res) => {
    const rFail = Math.random() < 0.5 // 50% chance of failure

    if (rFail) {
        index++
        return res.status(500)
            .json({ result: 'Intermittent server error' })
    } else {
        return res.status(200).json({ 'result': index++ })
    }    
})

app.post('/student', async (req, res, next) => {
    try {
        const student = await Student.create(req.body)
        res.status(status.OK).json({ succes: true, message: student })
    } catch (error) {
        // Pass the error to Express error handler middleware
        next(error)
    }
})

app.post('/schedule', async (req, res, next) => {
    try {
        const schedule = await Schedule.create(req.body)
        res.status(status.OK).json({ succes: true, message: schedule })
    } catch (error) {
        // Pass the error to Express error handler middleware
        next(error)
    }
})

// global error handler
app.use(errorHandler)

// not found - 404
app.use((req, res) => {
    logger.info(`api url not found - ${req.url}`)

    res.status(status.NOT_FOUND).json({ error: 'Not found' })
})

// start express server
const servicePort = PORT || 3002
app.listen(servicePort, () => {
    logger.info('service is being started')

    // eslint-disable-next-line no-console
    console.log(chalk.green(`-> Service API running at http://localhost:${servicePort}`))
})
