const { nanoid } = require('nanoid')
const bcrypt = require('bcryptjs')
const URL = require('../models/url')

async function generateShortUrl(req, res) {
    try {
        const { url, isPrivate, password } = req.body
        const userId = req.user ? req.user.id : 'anonymous'
        if (!url) return res.status(400).json({ error: 'No url provided' })
        if (isPrivate && !password) {
            return res.status(400).json({ error: 'Password required for private links' })
        }
        const shortId = nanoid(8)
        const urlData = {
            shortId,
            redirectURL: url,
            visitHistory: [],
            isPrivate: isPrivate || false,
            createdBy: userId
        }
        if (isPrivate) {
            urlData.password = await bcrypt.hash(password, 10)
        }
        await URL.create(urlData)
        return res.json({ id: shortId, isPrivate: urlData.isPrivate })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ err: error.message })
    }
}

async function redirectShortUrl(req, res) {
    try {
        const shortId = req.params.shortId
        const entry = await URL.findOne({ shortId })
        if (!entry) return res.status(404).json({ error: 'Short URL not found' })
        if (entry.isPrivate) {
            const password = req.body?.password || req.query?.password

            if (!password) return res.render('password-prompt', { shortId })
            if (!entry.password) return res.status(500).json({ error: 'Private link is missing password' })
            const isValid = await bcrypt.compare(password, entry.password)
            if (!isValid) {
                return res.render('password-prompt', { shortId, error: 'Invalid password. Please try again.' })
            }
        }
        await URL.findOneAndUpdate({ shortId }, {
            $push: { visitHistory: { timestamp: Date.now() } }
        })
        res.redirect(entry.redirectURL)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ err: error.message })
    }
}

async function getAnalytics(req, res) {
    try {
        const result = await URL.findOne({ shortId: req.params.shortId })
        if (!result) return res.status(404).json({ error: 'Short URL not found' })
        res.status(200).json({
            Clicks: result.visitHistory.length,
            Analytics: result.visitHistory
        })
    } catch (error) {
        return res.json({ err: error })
    }
}

async function getUserLinks(req, res) {
    try {
        const userId = req.user?.id
        if (!userId) return res.status(401).json({ error: 'Not authenticated' })
        const links = await URL.find({ createdBy: userId }).sort({ createdAt: -1 })
        res.status(200).json({ links })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ err: error.message })
    }
}

async function expireLink(req, res) {
    try {
        const userId = req.user?.id
        if (!userId) return res.status(401).json({ error: 'Not authenticated' })
        const result = await URL.findOneAndDelete({
            shortId: req.params.shortId,
            createdBy: userId
        })
        if (!result) return res.status(404).json({ error: 'Link not found or not authorized' })
        res.status(200).json({ msg: 'Link expired successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ err: error.message })
    }
}

module.exports = { generateShortUrl, redirectShortUrl, getAnalytics, getUserLinks, expireLink }