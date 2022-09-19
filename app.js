require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const connectDB = require('./db/connect')

const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddelware = require('./middleware/error-handler')

//middleware
app.use(express.json())

//routes
app.get('/', (req, res) => {
    res.send('<h1>Store api<h1/><a href="/api/v1/products">Products route<a/>')
})

app.use('/api/v1/products', productsRouter)

//products routes
app.use(notFoundMiddleware)
app.use(errorMiddelware)

const port = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server listening to port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()