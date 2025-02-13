'use strict'

import mongoose from 'mongoose'

export const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        unit: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
            validate : {
                validator : Number.isInteger,
                message   : 'validation: {VALUE} is not an integer value'
            }
        },
    },
    { timestamps: true },
)

export default mongoose.model('Course', courseSchema)
