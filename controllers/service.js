/*
 * Copyright 2022 SoftCraft Incorporated. All rights reserved.
 * SPDX-License-Identifier: MIT
 * Name: Clem Onawole
 * Email: dapo.onawole@gmail.com
 */

'use strict'

import axios from 'axios'
import axiosRetry from 'axios-retry'
import status from 'http-status'
import CircuitBreaker from 'opossum'


// patterns - retries, circuit breaker, bulkhead

// retry configuration with axios-retry
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay })

const fetchDataWithRetry = async (url, payload = undefined) => {

    try {
        if (payload === undefined)
        {
            const { data } = await axios.get(url)
            return data
        } else {
            const { data } = await axios.post(url, payload)
            return data
        }
    } catch (error) {
        logger.info('Failed to fetch data after retries', error.message)
    }
}

// circuit breaker configuration
const breaker = new CircuitBreaker(fetchDataWithRetry, {
    timeout: 3000, // Max operation time
    errorThresholdPercentage: 50, // Failure threshold to "open" the circuit
    resetTimeout: 5000, // Time before attempting to "close" the circuit again
})

breaker.fallback(() => 'Service temporarily unavailable')

export class ServiceController {

    caller = async(_req, res, _) => {

        const result = await breaker.fire('http://localhost:8082/unstable')
        res.status(status.OK).send(result)
    }

    alive = async(_req, res, _) => {

        res.status(status.OK).json({ succes: true, message: 'alive!' })
    }

    ping = (_req, res, _) => {

        res.status(status.OK).json({ succes: true, message: 'pong!' })
    }

    health = (_req, res, _) => {

        res.status(status.OK).json({ succes: true, message: 'alive!' })
    }

    getnames = (_req, res, _) => {

        res.status(status.OK).json(['Tony', 'Lisa', 'Michael', 'Ginger', 'Food'])
    }

    senderr = async(_req, res, _) => {

        res.status(status.INTERNAL_SERVER_ERROR).send({ success: false, error: 'thrown to simulate error' })
    }

    rthrow = async(_req, _res, next) => {
        try {
            // Some code that might throw an error
            throw new Error('error raised with throw')
    
        } catch (error) {
            // pass the error to Express error handler middleware
            next(error)
        }
    }

    addschedule = async(req, res, _) => {

        const result = await breaker.fire('http://localhost:8082/schedule', req.body)
        res.status(status.OK).send(result)
    }

    addstudent = async (req, res, _) => {

        const result = await breaker.fire('http://localhost:8082/student', req.body)
        res.status(status.OK).send(result)
    }
}