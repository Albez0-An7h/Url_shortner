const mongoose = require('mongoose')

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectMongo(url) {
    if (cached.conn) {
        console.log('Using cached MongoDB connection')
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        }

        cached.promise = mongoose.connect(url, opts).then((mongoose) => {
            console.log('MongoDB connected successfully')
            return mongoose
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        console.error('MongoDB connection error:', error.message)
        throw error
    }

    return cached.conn
}

module.exports = { connectMongo }