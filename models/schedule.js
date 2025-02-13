import mongoose from 'mongoose'
import validator from 'validator'

const capitalizeFirstLetter = v => `${v.charAt(0).toUpperCase()}${ v.slice(1).toLowerCase()}`

export const scheduleSchema = new mongoose.Schema(
    {
        vendoraccount: {
            type: String,
            required: true,
            minLength: 7,
            maxLength: 20,
        },
        firstname: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 20,
            set: v => capitalizeFirstLetter(v)
        },
        lastname: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 20,
            set: v => capitalizeFirstLetter(v)
        },
        email: {
            type: String,
            set: v => v.toLowerCase(),
            required: true,
            validate: {
                validator: validator.isEmail,
                message: 'validation: {VALUE} is not a valid email',
                isAsync: false
            }
        },
        addreessto: {
            type: String,
            required: true
        },
        movedate: {
            type: Date,
            required: true
        },
        time: {
            type: Date,
            required: true
        }
    },
    { timestamps: true },
)

export default mongoose.model('Schedule', scheduleSchema)
