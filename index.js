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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(authenticateToken)

connectMongo(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to Mongo')
})
.catch((err) => {
    console.error('Error in Mongo: ', err)
})

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

app.listen(PORT, () => {
    console.log(`Server Started at: ${PORT}`)
    console.log(`Server url: http://localhost:8000/`)
})