import mongoose from 'mongoose'
import validator from 'validator'

const capitalizeFirstLetter = v => `${v.charAt(0).toUpperCase()}${ v.slice(1).toLowerCase()}`

export const studentSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 20,
            set: v => capitalizeFirstLetter(v)
        },
        middlename: {
            type: String,
            minLength: 4,
            maxLength: 20,
            set: v => capitalizeFirstLetter(v)
        },
        lastname: {
            type: String,
            required: true,
            minLength: 5,
            maxLength: 20,
            set: v => capitalizeFirstLetter(v)
        },
        age: {
            type: Number,
            min: 13,
            max: 80,
            validate : {
                validator : Number.isInteger,
                message   : 'validation: {VALUE} is not an integer value'
            }
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
        sex: {
            type: String,
            required: true,
            enum: {
                values: ['Male', 'Female'],
                message: 'validation: {VALUE} is not supported'
            }
        },
        dateofbirth: {
            type: Date,
            required: true
        },
        isactive: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true },
)

studentSchema.virtual('fullname').get(() =>  `${lasttname}, ${firstname} ${middlename}`)

export default mongoose.model('Student', studentSchema)
