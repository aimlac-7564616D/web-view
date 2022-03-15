import { memo, useCallback, useEffect, useState } from 'react'
import ApexCharts from 'apexcharts'
import styled from 'styled-components'
import _ from 'lodash'

import { useStore } from '../helper/Store'
import ReactApexChart from 'react-apexcharts'

const ChartBox = styled.div`
  margin: .5em .5em 1em .5em;
  padding: 1em;
  border-radius: .5em;
  overflow-x: scroll;
  background-color: var(--text-icon);
  color: var(--text-primary);
  box-shadow: 0 .15em .5em rgba(0, 0, 0, .1);
  @media only screen and (max-width: 560px) {
    width: calc(100vw - 1em);
    margin: 0 0 1em 0;
    padding: .5em;
    padding-top: 1em;
  }
`

const ChartTitle = styled.p`
  display: block;
  margin: 0;
  padding: 0 1em 0 0;
  font-size: 1.5em;
  overflow: scroll;
  @media only screen and (max-width: 560px) {
    font-size: 1em;
  }
`

const ButtonGroup = styled.div`
  .btn {
    padding: .1em 1em;
    font-weight: 700;
    font-size: .75em;
    color: var(--color-primary);
    @media only screen and (max-width: 560px) {
      font-size: .6em;
      padding: .1em .75em;
    }
  }
  .btn {
    border: .09em solid transparent;
    border-color: var(--color-primary);
  }
  .btn-check:checked+.btn, .btn:focus {
    background-color: var(--color-primary);
    color: var(--text-icon);
    // pointer-events: none;
    outline: none;
    box-shadow: none;
  }
`

const StatefulChart = memo(({id, ...props}) => {
  const [globalState, ] = useStore()
  const getChartJSON = useCallback(() => _.merge({
    options: {
      chart: {
        id: id || _.uniqueId('chart'),
        background: '0', fontFamily: 'Lato, sans-serif'},
      theme: {mode: globalState.theme},
      tooltip: {theme: globalState.theme},
      title: {style: { fontSize: 0 }}
    },
    height: props.height || 350
  }, props), [ id, props, globalState.theme ])
  return <ReactApexChart {...getChartJSON()} />
}, (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps))

const SimpleChart = (props) => {
  const [globalState, ] = useStore()
  return <div className='col-xl-6'>
    <ChartBox className='g-0'>
      <ChartTitle>
        { (props.options.title) && props.options.title.text }
      </ChartTitle>
      <StatefulChart theme={globalState.theme} {...props} />
    </ChartBox>
  </div>
}

const DatetimeChart = (props) => {
  const [chartId, ] = useState(_.uniqueId('chart'))
  const [selection, setSelection] = useState('A')
  
  const tsZoom = useCallback((ts) => {
    try {
      let minTime = Number.POSITIVE_INFINITY
      let maxTime = Number.NEGATIVE_INFINITY
      props.series.forEach(series => {
        series.data.forEach(data => {
          minTime = Math.min(data[0], minTime)
          maxTime = Math.max(data[0], maxTime)
        })
      })
      let last = new Date(maxTime)
      let from = new Date(maxTime)
      switch (ts) {
        case 'H': from.setHours(last.getHours() - 3); break
        case 'D': from.setDate(last.getDate() - 1); break
        case 'W': from.setDate(last.getDate() - 7); break
        case 'M': from.setMonth(last.getMonth() - 1); break
        case 'Y': from.setFullYear(last.getFullYear() - 1); break
        case 'A': from = new Date(minTime); break
        default: break
      }
      from = Math.max(minTime, from.getTime())
      last = Math.min(maxTime, last.getTime())
      ApexCharts.exec(chartId, 'zoomX', from, last)
    } catch (error) {  }
  }, [chartId, props])

  useEffect(() => {
    tsZoom(selection)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCheck = useCallback((event) => {
    let ts = event.target.name.charAt(0)
    setSelection(ts)
    tsZoom(ts)
  }, [setSelection, tsZoom])

  return <div className='col-xl-6'>
    <ChartBox className='g-0'>
      <div className='d-flex justify-content-between'>
        <ChartTitle className='my-auto'>{ (props.options.title) && props.options.title.text }</ChartTitle>
        <ButtonGroup className='btn-group my-auto' role='group'>
        {
          ['M', 'W', 'D', 'H', 'All'].reduce((prev, cur, index) => {
            let id = _.uniqueId(cur)
            return [...prev,
              <input
                key={2 * index}
                type='radio'
                className='btn-check'
                id={id}
                name={id}
                checked={selection === cur.charAt(0)}
                onChange={handleCheck}
                autoComplete='off'
              />,
              <label
                key={2 * index + 1}
                className='btn'
                htmlFor={id}
              >{cur}</label>
            ]
          }, [])
        }
        </ButtonGroup>
      </div>
      <StatefulChart id={chartId} {...props} />
    </ChartBox>
  </div>
}

export { SimpleChart, DatetimeChart }