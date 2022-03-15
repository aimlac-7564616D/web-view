const express = require('express')

const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

const { authRouter } = require('./routes/auth')
const { chartRouter } = require('./routes/chart')
const { userRouter } = require('./routes/user')

const config = require('./config')
const port = config.PORT
const app = express()

// for react-app
app.use(express.static(path.resolve(__dirname, './build')))

app.use(cookieParser())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/chart', chartRouter)
app.use('/api/user', userRouter)

app.get('/api/debug', (req, res) => {
  res.send({status: 'OK'})
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
})

app.listen(port, () => {
  console.log(`Running server on port ${port}`)
})