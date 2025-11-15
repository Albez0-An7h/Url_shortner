const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const USER = require('../models/auth')


async function handleSignup(req, res) {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are mandatory' })
        }
        const emailCheck = await USER.findOne({ email })
        if (emailCheck) {
            return res.status(409).json({ error: "Email is already taken" })
        }
        const hashed = await bcrypt.hash(password, 10)
        await USER.create({
            username,
            email,
            password: hashed
        })
        return res.status(201).json({ msg: "Account created successfully" })
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Some error occurred" })
    }
}

async function handleSignin(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are mandatory' })
        }
        const user = await USER.findOne({ email })
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        const JWT_SECRET = process.env.JWT_SECRET
        const token = jwt.sign(
            {
                id: user._id.toString(),
                username: user.username,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        )
        
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        })
        return res.status(200).json({
            msg: "Signed in successfully",
            username: user.username,
            email: user.email
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Some error occurred" })
    }
}

async function handleSigninPage(req, res, JWT_SECRET) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).render('signin', { error: 'All fields are mandatory' })
        }
        const user = await USER.findOne({ email })
        if (!user) {
            return res.status(404).render('signin', { error: 'User not found' })
        }
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(401).render('signin', { error: 'Invalid credentials' })
        }
        
        const token = jwt.sign(
            {
                id: user._id.toString(),
                username: user.username,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '7d' } 
        )
        
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        })
        return res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.status(500).render('signin', { error: "Some error occurred" })
    }
}

async function handleLogout(req, res) {
    res.clearCookie('token')
    res.redirect('/')
}

function authenticateToken(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        req.user = null
        return next()
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null
        } else {
            req.user = user
        }
        next()
    })
}

module.exports = { handleSignin, handleSignup, handleSigninPage, handleLogout, authenticateToken }