const express = require('express')
const bodyParser = require('body-parser')
const connectDB = require('./config/dbConnect')
const morgan = require('morgan')
const helmet = require('helmet')

require('express-async-errors')
const adminRoutes = require('./routes/adminRoutes')
const authRoutes = require('./routes/authRoutes')
const groupRoutes = require('./routes/groupRoutes')
const messageRoutes = require('./routes/messageRoutes')

const app = express()
const port = process.env.PORT || 3002

app.use(bodyParser.json())
app.use(helmet())
app.use(morgan('dev'))

connectDB()

// Routes
app.use('/admin', adminRoutes)
app.use('/auth', authRoutes)
app.use('/groups', groupRoutes)
app.use('/messages', messageRoutes)

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

module.exports = server
