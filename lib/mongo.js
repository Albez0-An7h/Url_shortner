const mongoose = require('mongoose')

let isConnected = false

async function connectMongo(url) {
    if (isConnected) {
        console.log('Using existing MongoDB connection')
        return
    }

    try {
        await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000,
        })
        isConnected = true
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        throw error
    }
}

module.exports = { connectMongo }