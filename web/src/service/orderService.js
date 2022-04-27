import { apiCall } from "../helper/apiTools"

const fetchOrder = async (date) => {
  const url = `/api/order/get?date=${date}`
  let ok = false
  let data = []
  try {
    const response = await apiCall(url, { method: "GET", credentials: "include" })
    if (response.ok)
    data = await response.json()
    ok = response.ok
  } catch (error) {
    ok = false
    console.log(error)
  }
  return {data, ok}
}

export { fetchOrder }
