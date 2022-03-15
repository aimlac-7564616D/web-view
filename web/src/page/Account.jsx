import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Control, Overview } from '../component/Profile'
import UserProfile from '../component/UserProfile'
import Error from '../page/Error'
import Loading from '../page/Loading'
import { useStore } from '../helper/Store'
import { logout } from '../service/authService'
import { getProfile } from '../service/accountService'
import AdminPanel from '../component/AdminPanel'

const Container = styled.div`
  display: flex;
  flex-direction: row!important;
  width: 100%;
  @media only screen and (max-width: 560px) {
    flex-direction: column!important;
    width: calc(100vw - 1em);
  }
`

const Column = styled.div`
  width: ${props => props.width || 100}%;
  padding-right: var(--bs-gutter-x,.75em);
  padding-left: var(--bs-gutter-x,.75em);
  @media only screen and (max-width: 560px) {
    width: 100%;
  }
`

const Account = () => {
  const [profile, setProfile] = useState({})
  const [globalState, dispatch] = useStore()
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'account'
    const load = async () => {
      let {profile, ok} = await getProfile()
      if (ok) {
        setProfile(profile)
        setReady(true)
      } else {
        setError(true)
      }
    }
    load().catch(err => setError(true))
    const timer = setTimeout(() => setError(!ready), 30000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleTheme = useCallback((event) => {
    let theme = (globalState.theme === 'dark') ? 'light' : 'dark'
    dispatch({ key: 'theme', value: theme })
    window.localStorage.setItem('theme', theme)
  }, [globalState.theme, dispatch])

  const toggleFontSize = useCallback((event) => {
    let fontSize = (globalState.fontSize === '150') ? '100' : '150'
    dispatch({ key: 'fontSize', value: fontSize })
    window.localStorage.setItem('fontSize', fontSize)
  }, [globalState.fontSize, dispatch])

  const handleLogout = useCallback(
    () => logout().then(() => navigate('/login')), [navigate]
  )

  const updateProfile = useCallback(
    newProfile => setProfile(oldProfile => {
      return {...oldProfile, ...newProfile}
    }), [setProfile]
  )

  return (ready) ? <Container>
    <Column width={50}>
      <Overview uid={profile.userID} role={profile.userRole} />
      <Control
        theme={globalState.theme}
        fontSize={globalState.fontSize}
        handlers={
          { toggleTheme, toggleFontSize, handleLogout }
        }
      />
    </Column>
    <Column>
      <UserProfile profile={profile} handler={updateProfile} />
      {(profile.userRole === 'admin') && <AdminPanel />}
    </Column>
  </Container> : (error) ? <Error /> : <Loading />
}
export default Account