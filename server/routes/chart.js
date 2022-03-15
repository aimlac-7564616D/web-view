const express = require('express')
const crypto = require('crypto')
const fs = require('fs')
const md5 = require('md5')
const path = require('path')

const db = require('../db')
const { JWT_SECRET } = require('../config')
const { requireJWTToken } = require('./auth')

const router = express.Router()
router.use(requireJWTToken)

const SECRET = md5(JWT_SECRET)
const IV = crypto.randomBytes(16)

const encrypt = (data) => {
  const cipher = crypto.createCipheriv('aes-256-ctr', SECRET, IV)
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
  return IV.toString('hex') + encrypted.toString('hex')
}

const decrypt = (payload) => {
  const iv = payload.slice(0, 32)
  const hash = payload.slice(32)
  const decipher = crypto.createDecipheriv('aes-256-ctr', SECRET, Buffer.from(iv, 'hex'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash, 'hex')),
    decipher.final()]
  )
  return decrypted.toString()
}

router.get('/dashboard/:name', (req, res) => {
  let { name } = req.params
  try {
    let filePath = path.join(__dirname, '../dashboard', `${name}.json`)
    const dashboard = JSON.parse(fs.readFileSync(filePath))
    // encrypt sql query
    dashboard.data = Object.keys(dashboard.data).reduce((prev, key) => ({
      ...prev, [key]: encrypt(dashboard.data[key])
    }), {})
    res.status(200).json(dashboard)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'error reading dashboard definition'})
  }
})

router.post('/query', async (req, res) => {
  const { sql, hash } = req.body
  try {
    let decryptedSql = decrypt(sql)
    const {rows, fields} = await db.query(decryptedSql)
    const cols = fields.reduce(
      (prev, curr) => (
        { ...prev, [curr.name]: db.type[curr.type] }
      ), {}
    )
    const resp = { rows: rows, cols: cols }
    resp.hash = md5(JSON.stringify(resp))

    if (resp.hash === hash) { res.status(204).send() }
    else { res.status(200).json(resp) }
  } catch (error) {
    res.status(500).json({message: JSON.stringify(error)})
  }
})

module.exports = { chartRouter: router }