const mysql = require('mysql')

const config = require('./config')

const dbConfig = {
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASS,
  database: config.DB_DATABASE
}

const conn = mysql.createConnection(dbConfig)

const establishConnection = () => (
  new Promise((resolve, reject) => {
    conn.connect(err => {
      if (err) {
        reject(err)
        return
      }
      let dbURL = `${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
      console.log(`Connected to database: ${dbURL}`)
      resolve(true)
    })
  })
)

const connect = async (app) => {
  let connected = false
  while (!connected) {
    try {
      connected = await establishConnection()
    } catch ( error ) {}
    // wait for 1s
    await new Promise(r => setTimeout(r, 1000))
  }
  app.emit('ready')
}

const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, rows, fields) => {
      if (err) {
        reject(err)
        return
      }
      resolve({rows, fields})
    })
  })
}

const queryOne = async (sql, params) => {
  const {rows, } = await query(sql, params)
  return rows[0]
}

module.exports = {
  connect: connect,
  query: query,
  queryOne: queryOne,
  type: mysql.Types
}