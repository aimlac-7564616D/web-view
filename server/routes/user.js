const express = require('express')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../config')
const db = require('../db')
const { requireJWTToken  } = require('./auth')

const router = express.Router()
router.use(requireJWTToken)

const requireAdmin = async (req, res, next) => {
  const payload = jwt.verify(req.cookies.token, JWT_SECRET)
  const query = `SELECT userRole FROM userData WHERE userID = ?;`
  try {
    const user = await db.queryOne(query, [payload.userID])
    if (user && (user.userRole === 'admin')) next()
    else res.status(401).json({message: 'admin only'})
  } catch (error) {
    res.status(500).json({message: 'error validating role'})
  }
}

router.get('/profile', async (req, res) => {
  try {
    const payload = jwt.verify(req.cookies.token, JWT_SECRET)
    const query = `SELECT * FROM userData WHERE userID = ?;`
    const user = await db.queryOne(query, [payload.userID])
    if (!user) {
      res.status(500).json({message: `user not found`})
      return
    }
    delete user.userPassword
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({message: JSON.stringify(error)})
  }
})

router.post('/update', async (req, res) => {
  const profile = {...req.body}

  const searchIdQuery = `SELECT * FROM userData WHERE userID = ?;`
  let user = await db.queryOne(searchIdQuery, [profile.userID])
  if (!user) {
    res.status(400).json({message: `username not found`})
    return
  }
  
  if (profile.userPassword) {
    const passHash = crypto.createHash('SHA256').update(profile.userPassword).digest('hex')
    if (passHash !== user.userPassword) {
      res.status(400).json({message: `incorrect password`})
      return
    }
  }
  
  try {
    // ignore id and role
    let {userID, userRole, newPassword, ...updatedProfile} = profile
    if (newPassword) {
      let newPassHash = crypto.createHash('SHA256').update(newPassword).digest('hex')
      updatedProfile.userPassword = newPassHash
    }
    let keys = [], values = []
    Object.keys(updatedProfile).forEach(key => {
      keys.push(key)
      values.push(updatedProfile[key])
    })
    const updateQuery = 'UPDATE userData SET ' + keys.map(k => `${k} = ?`).join() + ';'
    await db.query(updateQuery, values)

    const query = `SELECT * FROM userData WHERE userID = ?;`
    const updatedUser = await db.queryOne(query, [profile.userID])
    
    if (Object.keys(updatedProfile).some(k => updatedProfile[k] !== updatedUser[k])) {
      res.status(500).json({message: `update failed`})
      return
    }
    res.status(200).json({message: 'updated'})
  } catch(error) {
    console.log(error)
    res.status(500).json({message: `update failed`})
  }
})

router.get('/fetch-users', requireAdmin, async (req, res) => {
  const token = jwt.verify(req.cookies.token, JWT_SECRET)
  const query = `SELECT * FROM userData WHERE userID <> 'admin' AND userID <> ?`
  try {
    // (new Promise((resolve, reject) => db.query(query, [token.userID],
    //   (err, rows) => {
    //     if (err) reject(err)
        
    //     resolve(data)
    //   }))
    // ).then(data => res.status(200).json(data))
    const { rows } = await db.query(query, [token.userID])
    rows.forEach(row => {delete row.userPassword})
    res.status(200).json(rows)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'fail to fetch users'})
  }
})

router.post('/delete', requireAdmin, async (req, res) => {
  const { userID } = req.body
  if (!userID) res.status(400).json({message: 'no userID'})
  if (userID === 'admin') res.status(400).json({message: 'cannot delete admin'})

  const query = 'DELETE FROM userData WHERE userID = ?'
  try {
    await db.query(query, [userID])
    res.status(200).json({status: 'OK'})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'fail to delete user'})
  }
})

router.post('/change-role', requireAdmin, async (req, res) => {
  const { userID, userRole } = req.body
  if (!userID) res.status(400).json({message: 'no userID'})
  if (userID === 'admin') res.status(400).json({
    message: 'cannot change admin\'s role'
  })

  const query = 'UPDATE userData SET userRole = ? WHERE userID = ?'
  try {
    await db.query(query, [userRole, userID])
    res.status(200).json({status: 'OK'})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'fail to change user\' role'})
  }
})

module.exports = { userRouter: router }