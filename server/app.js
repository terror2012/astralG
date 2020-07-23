const express = require('express')

require('dotenv').config()

const bodyParser = require('body-parser')

const morgan = require('morgan')

const app = express()

const mongoose = require('mongoose')

var cookieParser = require('cookie-parser')

const login_routes = require('./routes/login_routes.js')

var session = require('express-session')

var cors = require('cors')
const { MemoryStore } = require('express-session')

//var RedisSession = require('connect-redis')(session)


mongoose.connect(process.env.MONGO_CON_STRING)

var corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true
}

app.use(morgan('combined'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser('secret'))

app.use(bodyParser.json())

app.use(session({
    secret: 'secret',
    resave: false
}))

app.use('/', cors(corsOptions), login_routes)


var listener = app.listen(process.env.PORT || 8081, function () {
    console.log('Listening on port ', listener.address().port)
})