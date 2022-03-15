import _ from 'lodash'
import md5 from 'md5'
import { apiCall } from '../helper/apiTools'

const ENABLE_CACHE = true

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

const getDashboardDefinition = async (tag) => {
  const url = `/api/chart/dashboard/${tag}`
  const response = await apiCall(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })
  return await response.json()
}

const queryDatabase = async (sql, hash) => {
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
        data = JSON.parse(window.localStorage.getItem(hash))
        update = true
      }
    } else {
      data = await response.json()
      if (ENABLE_CACHE) {
        // update cache
        window.localStorage.removeItem(hash)
        window.localStorage.setItem(md5(sql), data.hash)
        window.localStorage.setItem(data.hash, JSON.stringify(data))
      }
      update = true
    }
  } catch (error) { console.log(error) }
  return {data, update}
}

const updateData = async (sql, history) => {
  const hash = (history) ? history.hash : (
    (ENABLE_CACHE) ? window.localStorage.getItem(md5(sql)) : null
  )
  return await queryDatabase(sql, hash)
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