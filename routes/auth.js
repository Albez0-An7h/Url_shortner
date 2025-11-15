const express = require('express')
const { handleSignup, handleSignin } = require('../controllers/auth')
const router = express.Router()

router.post('/signup', handleSignup)
router.post('/signin', handleSignin)

module.exports = router