import mongoose from 'mongoose'
import chalk from 'chalk'

const options = {
    autoIndex: true,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    serverSelectionTimeoutMS: 5000,
}

const retries = 3

const connectDatabase = async () => {
    for (let i = 0; i < retries; ++i) {
        try {
            /* eslint-disable no-console */
            mongoose.connection.on('connected', () => console.log(chalk.green('-> datastore connected')))
            mongoose.connection.on('open', () => console.log(chalk.green('-> datastore open')))
            mongoose.connection.on('disconnected', () => console.log('datastoredisconnected'))
            mongoose.connection.on('reconnected', () => console.log('datastore reconnected'))
            mongoose.connection.on('disconnecting', () => console.log('datastore disconnecting'))
            mongoose.connection.on('close', () => console.log('datastore close'))
            /* eslint-enable no-console */

            const connection_string = `${process.env.MONGO_CONNECT}/nrData`
            const connection = await mongoose.connect( connection_string, options, )

            // eslint-disable-next-line no-console
            console.log(chalk.green(`\n-> Success dataStore connect to ${connection.connection.host}`))
            break
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(chalk.red(`\n${error.message}: Failed connect to database. App will exit!`))
            if (i >= retries - 1) { process.exit(1) }
        }
    }
}

export default connectDatabase
