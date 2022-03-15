import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Input = styled.input`
  background-color: var(--text-icon);
  color: var(--text-primary);
  &:focus {
    background-color: var(--text-icon);
    color: var(--text-primary);
    outline-clor: red;
    box-shadow: none;
    border-color: var(--color-primary);
  }
`

const FormButton = styled.button`
  display: inline-block;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  user-select: none;
  background-color: var(--color-primary);
  border-radius: .25em;
  border: none;
  color: var(--text-icon);
  font-size: 1em;
  font-weight: 400;
  padding: .75em;
  transition: all .1s;
  &:hover {
    background-color: var(--color-primary-dark);
    border-color: var(--color-primary-dark);
    color: var(--text-icon);
  }
  &:focus {
    background-color: var(--color-primary);
    outline: none;
    box-shadow: none;
  }
`

const FormMessage = styled.p`
  color: var(--color-danger);
  font-size: 0.75em;
  font-weight: 400;
`

const StyledLink = styled(Link)`
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
  &:hover {
    color: var(--color-primary-dark);
  }
`

const FormInput = (props) => (
  <div className='form-floating my-2'>
    <Input className='form-control' {...props} />
    <label htmlFor={props.name}>{props.placeholder}</label>
  </div>
)

const InputIcon = styled.div`
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.4em 0.4em;
  font-size: 1.5em;
  color: var(--color-primary);
  cursor: pointer;
  &:hover {
    color: var(--color-primary-dark);
  }
`

const ShowPassword = (props) => {
  const togglePassword = useCallback((element) => {
    let passwordField = document.querySelector(`#${props.id}`)
    passwordField.type = (passwordField.type === 'password') ? 'text' : 'password'
    element.target.classList.toggle('mdi-eye-off')
  }, [props.id])
  return <div className='form-floating my-2'>
    <Input className='form-control' {...props} type='password' />
    <label htmlFor={props.name}>{props.placeholder}</label>
    <InputIcon onClick={togglePassword} className='mdi mdi-eye mdi-eye-off' />
  </div>
}

export {
  FormButton,
  FormInput,
  FormMessage,
  ShowPassword,
  StyledLink
}