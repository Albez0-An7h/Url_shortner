const express = require('express')
const { generateShortUrl, redirectShortUrl, getAnalytics, getUserLinks, expireLink } = require('../controllers/url')
const router = express.Router()

router.post('/', generateShortUrl)
router.get('/analytics/:shortId', getAnalytics)
router.get('/my-links', getUserLinks)
router.delete('/expire/:shortId', expireLink)
router.post('/:shortId', redirectShortUrl)
router.get('/:shortId', redirectShortUrl)

module.exports = router