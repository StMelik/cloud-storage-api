require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const authRouter = require('./routes/auth.routes')
const filesRouter = require('./routes/file.routes')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const path = require('path')
const filePath = require('./middlewares/path.middleware')

const PORT = process.env.PORT || config.get('serverPort')
const app = express()

app.use(cors())
app.use(filePath(path.resolve(__dirname, 'files')))

// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//     allowedHeaders: ['Content-Type']
// }))

app.use(fileUpload({}))
app.use(express.json())

app.use(express.static('static'))

app.use('/', authRouter)
app.use('/files', filesRouter)



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
