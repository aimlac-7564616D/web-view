import { apiCall } from '../helper/apiTools'

const login = async (username, password) => {
  const url = '/api/auth/login'
  const payload = {
    username: username,
    password: password
  }
  try {
    const response = await apiCall(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
    return [await response.json(), response.ok]
  } catch (error) {
    return [{message: JSON.stringify(error)}, false]
  }
}

const logout = async () => {
  const url = '/api/auth/logout'
  await apiCall(url, {
    method: 'GET',
    credentials: 'include'
  })
}

const register = async(username, password) => {
  const url = '/api/auth/register'
  const payload = {
    username: username,
    password: password
  }
  try {
    const response = await apiCall(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
   return [await response.json(), response.ok]
  } catch (error) {
    return [{message: JSON.stringify(error)}, false]
  }
}

const verify = async () => {
  const url = '/api/auth/verify'
  try {
    const response = await apiCall(url, {
      method: 'GET',
      credentials: 'include',
      timeout: 10000
    })
    return response.ok
  } catch (error) { return false }
}

export {
  login,
  logout,
  register,
  verify
}