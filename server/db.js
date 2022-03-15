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
conn.connect(err => {
  if (err) throw err
  let dbURL = `${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
  console.log(`Connected to database: ${dbURL}`)
})

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
  query: query,
  queryOne: queryOne,
  type: mysql.Types
}