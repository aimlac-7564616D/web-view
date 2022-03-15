import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Loading from '../page/Loading'
import { verify } from '../service/authService'

const PrivateRoute = ({ children }) => {
  const [status, setStatus] = useState(0)
  useEffect(() => {
    verify().then(ok => setStatus((ok) ? 1 : 2))
  }, [])
  return [<Loading />, children, <Navigate to='/login' replace/>][status]
}

export default PrivateRoute