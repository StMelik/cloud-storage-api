const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const authRouter = require('./routes/auth.routes')

const PORT = config.get('serverPort')
const app = express()

app.use(express.json())
app.use('/', authRouter)


const start = async () => {
    try {
        await mongoose.connect(config.get('dbUrl'))

        app.listen(PORT, () => {
            console.log(`Сервер запустился на ${PORT} порту`);
        })
    } catch (e) {
        console.log(e);
    }
}

start()
