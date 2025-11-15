const express = require('express')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const { connectMongo } = require('./lib/mongo')
const path = require('path')
const urlRoute = require('./routes/url')
const authRoute = require('./routes/auth')
const { authenticateToken } = require('./controllers/auth')

const app = express()
const PORT = process.env.PORT || 8000
const JWT_SECRET = process.env.JWT_SECRET

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI environment variable is not set')
}
if (!JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set')
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

app.use(async (req, res, next) => {
    try {
        await connectMongo(process.env.MONGO_URI)
        next()
    } catch (error) {
        console.error('MongoDB connection failed:', error)
        res.status(500).json({ error: 'Database connection failed' })
    }
})

app.use(authenticateToken)

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/signin', (req, res) => {
    res.render('signin')
})

app.get('/dashboard', (req, res) => {
    if (!req.user) {
        return res.redirect('/signin')
    }
    res.render('dashboard', { user: req.user })
})

app.use('/api/url', urlRoute)
app.use('/api/auth', authRoute)

const { handleSigninPage, handleLogout } = require('./controllers/auth')
app.post('/auth/signin', (req, res) => handleSigninPage(req, res, JWT_SECRET))
app.get('/logout', handleLogout)


if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server Started at: ${PORT}`)
        console.log(`Server url: http://localhost:${PORT}/`)
    })
}


module.exports = app