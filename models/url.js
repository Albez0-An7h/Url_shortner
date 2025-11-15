const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    redirectURL: {
        type: String,
        required: true,
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        default: null
    },
    createdBy: {
        type: String,
        default: 'anonymous'
    },
    visitHistory: [{
        timestamp: { type: Number }
    }]
}, { timestamps: true })

const URL = mongoose.model('url', urlSchema)

module.exports = URL