import { apiCall } from "../helper/apiTools"

const getProfile = async () => {
  const url = '/api/user/profile'
  let profile = {}
  let ok = false
  try {
    const response = await apiCall(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    ok = response.ok
    if (ok) profile = await response.json()
  } catch (error) { console.log(error) }
  return {profile, ok}
}

const updateProfile = async (profile) => {
  const url = '/api/user/update'
  const payload = {...profile}
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

const fetchAllUsers = async () => {
  const url = '/api/user/fetch-users'
  let users = []
  let ok = false
  try {
    const response = await apiCall(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    if (response.ok) 
      users = await response.json()
    ok = response.ok
  } catch (error) {
    ok = false
    console.log(error)
  }
  return {users, ok}
}

const deleteUser = async (userID) => {
  const url = '/api/user/delete'
  const payload = {userID: userID}
  const response = await apiCall(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  return response.ok
}

const updateUserRole = async (userID, userRole) => {
  const url = '/api/user/change-role'
  const payload = {userID: userID, userRole: userRole}
  const response = await apiCall(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  return response.ok
}

export {
  getProfile,
  updateProfile,
  fetchAllUsers,
  deleteUser,
  updateUserRole
}