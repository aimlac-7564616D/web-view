import { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { fetchOrder } from "../service/orderService"
import Error from "./Error"
import Loading from "./Loading"

const Container = styled.div`
  display: block;
  width: 100%;
  margin-top: 3em;
  justify-content: center;
  @media only screen and (max-width: 560px) {
    width: calc(100vw - 1em);
  }
`

const DatePicker = styled.input`
  margin: 0 auto;
  width: auto;
  display: block;
  text-align:center;
  background-color: var(--background);
  color: var(--color-primary-dark);
  font-size: 1.5em;
  border: none;
  &:focus {
    color: var(--color-primary-dark);
    background-color: var(--background);
    outline: none;
    box-shadow: none;
  }
  &::-webkit-calendar-picker-indicator {
    background-color: var(--color-primary);
    border-radius: .25em;
    margin: .1em;
    padding: .2em;
    transition: all .2s;
    &:hover {
      background-color: var(--color-primary-dark);
      padding: .3em;
      margin: 0;
    }
  }
`

const Table = styled.table`
  margin: 0 auto;
  margin-top: 1.5em;
  text-align: center;
  thead {
    background-color: var(--color-primary);
    color: var(--text-icon);
  }
  tbody {
    background-color: var(--text-icon);
    color: var(--text-primary);
  }
  width: 75%;
  @media only screen and (max-width: 560px) {
    width: 100%;
    th, td {
      padding: .25em 1em;
    }
  }
`

const OderData = ({ order }) => {
  return <Table className="table shadow-sm">
    <thead>
      <tr>
        <th>OrderID</th>
        <th>Time</th>
        <th>Price £</th>
        <th>Volume</th>
        <th>Type</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {
        (order.length) ? (
          order.map((row, key) => <tr key={key}>
            <td>{row.order_id}</td>
            <td>{(row.hour_ID - 1).toString().padStart(2, "0")}:00</td>
            <td>{(!row.price) ? "NaN" : row.price.toFixed(2)}</td>
            <td>{(!row.volume) ? "NaN" : row.volume.toFixed(2)}</td>
            <td>{row.type}</td>
            <td>
              {
                (row.accepted) ?
                  <i className="mdi mdi-checkbox-outline" />
                : <i className="mdi mdi-checkbox-blank-outline" />
              }
            </td>
          </tr>)
        ) : <tr><td colSpan="6">no data</td></tr>
      }
    </tbody>
  </Table>
}

const Order = () => {
  const formatDateString = (date) => {
    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString().padStart(2, "0")
    let day = date.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const [date, setDate] = useState(formatDateString(new Date()))
  const [order, setOrder] = useState([])
  const [error, setError] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.title = 'order'
  }, [])

  useEffect(() => {
    fetchOrder(date).then(({data, ok}) => {
      if (ok) {
        setOrder(data)
        setReady(true)
      } else {
        setError(true)
      }
    }).catch(err => setError(true))
  }, [date])

  const handleSelectDate = useCallback((event) => {
    setReady(false)
    setDate(event.target.value)
  }, [setDate, setReady])

  return (ready) ? <Container>
    <DatePicker
      name="date"
      className="form-control"
      type="date"
      value={date}
      onChange={handleSelectDate}
    />
    <OderData order={order} />
  </Container> : (error) ? <Error /> : <Loading />
}

export default Order
