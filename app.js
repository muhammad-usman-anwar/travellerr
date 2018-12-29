const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth')
const carRoutes = require('./routes/car')
const chatRoutes = require('./routes/chat')
const postRoutes = require('./routes/post')
const tripRoutes = require('./routes/trip')
const EmailService = require('./emailService')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Token')
    next()
})

app.use('/api/user', authRoutes)
app.use('/api/car', carRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/post', postRoutes)
app.use('/api/trip', tripRoutes)

app.use((error, req, res, next) => {
    console.log(error)
    res.status(error.statusCode).json({
        message: error.message,
        data: error.data
    })

})

mongoose
    .connect('mongodb://localhost/travellerr', {
        useNewUrlParser: true
    })
    .then(result => {
        const server = app.listen(3030)
        EmailService.init('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')
        const io = require('./socket').init(server)
    })
    .catch(err => {
        console.log(err)
    })