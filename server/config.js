module.exports = {
  PORT: process.env.PORT || 3000,
  DB_USER: process.env.SQL_USER,
  DB_PASS: process.env.SQL_PASS,
  DB_HOST: process.env.SQL_HOST,
  DB_PORT: process.env.SQL_PORT || 3306,
  DB_DATABASE: process.env.SQL_DATABASE,
  JWT_SECRET: process.env.JWT_SECRET || 's3cr3t_k3y'
}