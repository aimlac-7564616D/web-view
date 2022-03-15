import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PrivacyPolicy from '../asset/privacyPolicy'
import FormContainer from '../component/FormContainer'
import PopupDialog from '../component/PopupDialog'
import RegisterForm from '../component/RegisterForm'
import { register } from '../service/authService'

const Register = () => {
  useEffect(() => {
    document.title = 'register'
  }, [])

  const [state, setState] = useState({
    user: '',
    pass: '',
    mssg: '',
    agree: false
  })
  const [policyId, ] = useState(_.uniqueId('id-'))
  const navigate = useNavigate()

  const handleCheck = useCallback((event) => {
    setState(prevState => {
      const key = event.target.id
      const value = event.target.checked
      return {...prevState, [key]: value}
    })
  }, [setState])

  const handleInput = useCallback((event) => {
    setState(prevState => {
      let key = event.target.id
      let value = event.target.value.replace(/\s/g, '')
      return {...prevState, [key]: value}
    })
  }, [setState])

  const handleSubmit = useCallback((event) => {
    if (!event.target.checkValidity()) {
      setState(prevState => ({...prevState, mssg: `form incomplete`}))
    } else {
      let user = event.target.user.value
      let pass = event.target.pass.value
      setState(prevState => ({...prevState, mssg: ''}))
      register(user, pass).then((([res, ok]) => {
        if (!ok) {
          setState(prevState => ({...prevState, mssg: res.message}))
        } else {
          navigate('complete')
        }
      })).catch(err => console.log(err))
    }
    event.preventDefault()
  }, [setState, navigate])

  return <FormContainer>
    <h3>Account Creation</h3>
    <RegisterForm data={state}
      policyId={policyId}
      handlers={{
        handleCheck: handleCheck,
        handleInput: handleInput,
        handleSubmit: handleSubmit
      }}
    />
    <PopupDialog id={policyId} header='Privacy Policy'>
      {PrivacyPolicy}
    </PopupDialog>
  </FormContainer>
}

export default Register