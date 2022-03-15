const crypto = require('crypto')
const express = require('express')
const eJwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const db = require('../db')

const router = express.Router()

const { JWT_SECRET } = require('../config')
const requireJWTToken = [
  eJwt({
    secret: JWT_SECRET, getToken: req => req.cookies.token, algorithms: ['HS256']
  }),
  (err, req, res, next) => {
    (err) ? res.status(err.status).json(err) : next()
  },
]

router.post('/login', async (req, res) => {
  let username, password
  try {
    ({ username, password } = req.body)
    if (username === undefined || password === undefined)
      throw `username or password undefined`
  } catch (error) {
    res.status(400).json({message: `username or password undefined`})
    return
  }

  const query = `SELECT * FROM userData WHERE userID = ? AND userRole <> 'pending';`
  const user = await db.queryOne(query, [username])
  if (!user) {
    res.status(400).json({message: `username not found`})
    return
  }

  const passHash = crypto.createHash('SHA256').update(password).digest('hex')
  if (passHash !== user.userPassword) {
    res.status(401).json({message: `incorrect password`})
    return
  }
  
  const payload = { userID: user.userID }
  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '24h'})
  res.cookie('token', token, { httpOnly: true })
  res.status(200).json({token: token})
})
  
router.get('/logout', ...requireJWTToken, (req, res) => {
  res.cookie('token', '', { httpOnly: true, maxAge: 0 })
  res.status(200).json({status: 'OK'})
})

router.post('/register', async (req, res) => {
  let username, password
  try {
    ({ username, password } = req.body)
    if (username === undefined || password === undefined)
      throw `username or password undefined`
  } catch (error) {
    res.status(400).json({message: `username or password undefined`})
    return
  }

  const searchIdQuery = `SELECT userID FROM userData WHERE userID = ?;`
  const user = await db.queryOne(searchIdQuery, [username])
  if (user) {
    res.status(400).json({message: `username has been taken`})
    return
  }

  const passHash = crypto.createHash('SHA256').update(password).digest('hex')
  const insertQuery = `
    INSERT INTO userData SET
    userID = ?,
    userEmail = ?,
    userPassword = ?,
    userRole = 'pending';
  `
  try{
    await db.query(insertQuery, [
      username, `${username}@aimlac.com`, passHash
    ])
    res.status(200).json({status: 'OK'})
  } catch(error) {
    res.status(500).json({message: `registration failed`})
  }
})

router.get('/verify', ...requireJWTToken, (req, res) => {
  res.status(200).json({status: 'OK'})
})

module.exports = {
  authRouter: router,
  requireJWTToken: requireJWTToken
}