'use strict'

import appError from '../utils/appError.js'
import status from 'http-status'

const errorHandler = (err, _, res, next) => {
    if (! err) {
        return next()
    }

    let error = { ...err }
    error.message = err.message

    // mongoose duplicate Key
    if (err.code === 11000) {
        
        const z = err.message
        const re = z.split(' ')

        error = new appError('the entered ' + re[11] + 'duplicate value', status.BAD_REQUEST, )
    }

    // mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(
            (val) => val.message,
        )
        error = new appError(message, status.BAD_REQUEST)
    }

    res.status(error.statusCode || status.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message || 'Server Error',
    })
}

export default errorHandler
