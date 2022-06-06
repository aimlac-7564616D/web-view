const axios = require('axios')
const express = require('express')
const config = require('../config')

const { requireJWTToken } = require('./auth')

const router = express.Router()
router.use(requireJWTToken)

router.get('/get', async (req, res) => {
  let { date } = req.query
  try {
    const url = `http://${config.AIMLAC_RSE_ADDR}/auction/bidding/get`
    const params = `?key=${config.AIMLAC_RSE_KEY}&applying_date=${date}`
    const resp = await axios.get(url + params)
    res.status(200).json(await resp.data)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'error fetching order from RSE API'})
  }
})

module.exports = { orderRouter: router }