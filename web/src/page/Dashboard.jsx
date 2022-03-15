import { useEffect, useState } from 'react'
import { DatetimeChart, SimpleChart } from '../component/Charts'
import {
  getDashboardDefinition,
  plotChart,
  updateData
} from '../service/chartService'
import { useStore } from '../helper/Store'
import Error from './Error'
import Loading from './Loading'

const Dashboard = ({ tag }) => {
  const [globalState, dispatch] = useStore()
  const [charts, setCharts] = useState([])
  const [definition, setDefinition] = useState(
    '{"data": {}, "chart": [], "parents": {}, "flag": true}'
  )
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const load = async () => {
      let dashboardDef = await getDashboardDefinition(tag)
      setDefinition(JSON.stringify(dashboardDef))

      Object.keys(dashboardDef.data).forEach(async key => {
        let {data, update} = await updateData(
          key,
          dashboardDef.data[key],
          globalState.data[key]
        )
        if (update)
          dispatch({key: `data.${key}`, value: data})
      })
    }
    load().catch(err => {
      console.log(err)
      setError(true)
    })
    // error if not ready in 30s
    const timer = setTimeout(() => setError(!ready), 30000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag])

  useEffect(() => {
    let def = JSON.parse(definition)
    setCharts(
      plotChart(
        globalState.data,
        def.chart,
        def.parents
      )
    )
  }, [tag, globalState.data, definition, setCharts])

  useEffect(() => {
    // check if chart is ready to be displayed
    let def = JSON.parse(definition)
    setReady((def.chart.length === charts.length) && (!def.flag))
  }, [tag, charts, definition, setReady])

  useEffect(() => { (ready) && (document.title = tag) }, [tag, ready])

  return (ready) ? (
    <div className='row g-0'>
    {
      charts.map(
        (chartObj, index) => {
          let {template, ...chart} = chartObj
          switch(template) {
            case 'simple':
              return <SimpleChart key={index} {...chart} />
            case 'time-series':
              return <DatetimeChart key={index} {...chart} />
            default:
              return <SimpleChart key={index} {...chart} />
          }
        }
      )
    }
    </div>
  ) : ((error) ? <Error /> : <Loading />)
}

export default Dashboard