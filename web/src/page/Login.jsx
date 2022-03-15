import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormContainer from '../component/FormContainer'
import LoginForm from '../component/LoginForm'
import { login } from '../service/authService'

const Login = () => {
  useEffect(() => {
    document.title = 'login'
  }, [])

  const [state, setState] = useState(() =>{
    let user = window.localStorage.getItem('user')
    return {
      user: user || '',
      pass: '',
      mssg: '',
      rmbMe: !['', null, undefined].includes(user)
    }
  })
  const navigate = useNavigate()
  const setUser = useCallback(
    (user) => window.localStorage.setItem('user', user)
  , [])

  const handleInput = useCallback((event) => {
    setState(prevState => {
      const key = event.target.id
      const value = event.target.value.replace(/\s/g, '')
      if (key === 'user' && prevState.rmbMe) setUser(value)
      return {...prevState, [key]: value}
    })
  }, [setUser, setState])

  const handleRmbMe = useCallback((event) => {
    setState(state => {
      const rmbMe = !state.rmbMe
      setUser((rmbMe) ? state.user : '')
      return {...state, rmbMe: rmbMe}
    })
  }, [setUser, setState])
  
  const handleSubmit = useCallback((event) => {
    if (!event.target.checkValidity()) {
      setState(prevState => ({...prevState, mssg: `form incomplete`}))
    } else {
      let user = event.target.user.value
      let pass = event.target.pass.value
      setState(prevState => ({...prevState, mssg: ''}))
      login(user, pass).then(([res, ok]) => {
        if (ok) {
          navigate('/dashboard')
        } else {
          setState(prevState => ({...prevState, mssg: res.message}))
        }
      })
    }
    event.preventDefault()
  }, [setState, navigate])

  return <FormContainer>
    <h3>Account Login</h3>
    <LoginForm data={state}
      handlers={{
        handleInput: handleInput,
        handleRmbMe: handleRmbMe,
        handleSubmit: handleSubmit
      }} 
    />
  </FormContainer>
}

export default Login