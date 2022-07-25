import _ from 'lodash'
import { Buffer } from 'buffer'
import { deflateRaw, inflateRaw } from 'react-zlib-js'
import { apiCall } from '../helper/apiTools'

const ENABLE_CACHE = false

const DATATYPE = {
  DECIMAL: (v) => v,
  TINY: (v) => v,
  SHORT: (v) => v,
  LONG: (v) => v,
  FLOAT: (v) => v,
  DOUBLE: (v) => v,
  NULL: (v) => v,
  TIMESTAMP: (v) => v,
  LONGLONG: (v) => v,
  INT24: (v) => v,
  DATE: (v) => v,
  TIME: (v) => v,
  DATETIME: (v) => new Date(v),
  YEAR: (v) => v,
  NEWDATE: (v) => v,
  VARCHAR: (v) => v,
  BIT: (v) => v,
  TIMESTAMP2: (v) => v,
  DATETIME2: (v) => v,
  TIME2: (v) => v,
  JSON: (v) => v,
  NEWDECIMAL: (v) => v,
  ENUM: (v) => v,
  SET: (v) => v,
  TINY_BLOB: (v) => v,
  MEDIUM_BLOB: (v) => v,
  LONG_BLOB: (v) => v,
  BLOB: (v) => v,
  VAR_STRING: (v) => v,
  STRING: (v) => v,
  GEOMETRY: (v) => v
}

const compress = async (data) => {
  return await new Promise((resolve, reject) => {
    const input = JSON.stringify(data).toString('utf-8')
    deflateRaw(input, (err, buffer) => {
      if (err) {
        reject(err)
      } else {
        const string = buffer.toString('base64')
        if (string.length > 0)
          resolve(string)
      }
    })
  })
}

const decompress = async (data) => {
  return await new Promise((resolve, reject) => {
    const input = Buffer.from(data, 'base64')
    inflateRaw(input, (err, buffer) => {
      if (err) {
        reject(err)
      } else {
        const string = buffer.toString('utf-8')
        if (string.length > 0)
          resolve(JSON.parse(string))
      }
    })
  })
}

const getDashboardDefinition = async (tag) => {
  const url = `/api/chart/dashboard/${tag}`
  const response = await apiCall(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })
  return await response.json()
}

const queryNoCache = async (sql) => {
  const url = '/api/chart/query'
  const payload = { sql: sql }
  
  let data = {}
  try {
    const response = await apiCall(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      const message = (await response.json()).message
      console.log(message)
    } else {
      data = await response.json()
    }
  } catch (error) { console.log(error) }
  return data
}

const queryDatabase = async (key, sql, hash) => {
  const url = '/api/chart/query'
  const payload = { sql: sql, hash: hash }

  let data = {}
  let update = false

  try {
    const response = await apiCall(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const message = (await response.json()).message
      console.log(message)
    }
    else if (response.status === 204) {
      if (ENABLE_CACHE) {
        // get from cache & update state
        data = await decompress(window.localStorage.getItem(hash))
        update = true
      }
    } else {
      data = await response.json()
      update = true
      if (ENABLE_CACHE) {
        // update cache
        window.localStorage.removeItem(hash)
        try {
          window.localStorage.setItem(key, data.hash)
          window.localStorage.setItem(data.hash, (await compress(data)))
        } catch (error) { console.log(error) }
      }
    }
  } catch (error) {
    console.log(error)
    data = await queryNoCache(sql)
    update = true
  }
  return {data, update}
}

const updateData = async (key, sql, history) => {
  const hash = (history) ? history.hash : (
    (ENABLE_CACHE) ? window.localStorage.getItem(key) : null
  )
  return await queryDatabase(key, sql, hash)
}

const filterByColumns = (data, cols) => {
  return (data && cols) ? data.rows.map(
    row => cols.map(col => DATATYPE[data.cols[col]](row[col]))
  ) : []
}

const plotChart = (data, chartDef, parents) => {
  let charts = []
  try {
    charts = _.cloneDeep(chartDef).map(chart => {

      if (chart.inherit && parents[chart.inherit]) {
        chart = _.merge(_.cloneDeep(parents[chart.inherit]), chart)
      }

      chart.series.forEach(s => {
        s.data = filterByColumns(data[s.data.src], s.data.keys)
      })
      return chart
    })
  } catch (error) { console.log(error) }
  return charts
}

export { getDashboardDefinition, plotChart, updateData }