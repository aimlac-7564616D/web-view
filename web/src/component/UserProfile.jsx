import _ from 'lodash'
import { useCallback, useState } from 'react'
import { Panel } from './Profile'
import { FormMessage } from './FormItems'
import styled from 'styled-components'
import { updateProfile } from '../service/accountService'

const Field = styled.div`
  margin: .5em 0;
  font-size: 1em;
  label {
    color: var(--text-secondary);
    font-weight: 400;
    padding: .7em 0 0 .5em;
  }
  input:focus+label {
    color: var(--color-primary);
  }
  input:not(:placeholder-shown)+label {
    color: var(--color-primary);
  }
  input:disabled+label {
    color: var(--color-primary);
    font-weight: 700;
  }
  input {
    font-size: 1em;
    height: 3.1em!important;
    background-color: var(--text-icon);
    border-color: var(--text-secondary);
    border-radius: .25em;
    color: var(--text-primary);
    transition: margin .2s;
  }
  input:not(:placeholder-shown) {
    padding: 1em .5em 0 .5em!important;
  }
  input:focus {
    box-shadow: none;
    color: var(--text-primary);
    border-color: var(--color-primary);
    background-color: var(--text-icon);
  }
  input:disabled {
    border: none;
    color: var(--text-secondary);
    background-color: var(--text-icon);
    margin-left: 1.2em;
  }
`

const Button = styled.button`
  display: inline-block;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  user-select: none;
  background-color: ${props => (props.color || 'var(--color-primary)')};
  border-radius: .3em;
  border: none;
  color: var(--text-icon);
  font-size: 1em;
  font-weight: 700;
  margin-top: 1em;
  margin-left: .5em;
  padding: .4em 1.5em;
  transition: all .1s;
  &:hover {
    border-color: var(--color-primary-dark);
    color: var(--text-icon);
    filter: brightness(75%); 
  }
  &:focus {
    background-color: ${props => (props.color || 'var(--color-primary)')};
    outline: none;
    box-shadow: none;
  }
`

const ProfileField = (props) => {
  const [id, ] = useState(_.uniqueId('input'))
  const { icon, placeholder } = props
  return <Field className='form-floating'>
    <input className='form-control' id={id} {...props} />
    <label htmlFor={id}>
      <i className={`mdi ${icon}`}></i> {placeholder}
    </label>
  </Field>
}

const UserProfile = ({ profile, handler }) => {
  const [form, setForm] = useState(() => ({
    ...profile, edit: false, mssg: ''
  }))
  const [id, ] = useState(_.uniqueId('form'))

  const editProfile = useCallback((event) => {
    event.target.setAttribute('disabled', 'disabled')
    setForm(form => ({...form, edit: true}))
    // ugly fix
    const timer = setTimeout(() => {
      event.target.removeAttribute('disabled')
    }, 0)
    return () => clearTimeout(timer)
  }, [setForm])

  const saveChange = useCallback((event) => {
    let target = event.target
    setForm(form => ({...form, mssg: ''}))
    if (!target.checkValidity()) {
      setForm(form => ({...form, mssg: 'form incomplete'}))
    } else if (target.oldPassword.value && !target.newPassword.value) {
      setForm(form => ({...form, mssg: `please enter new password`}))
    } else if (target.newPassword.value !== target.confirmPassword.value) {
      setForm(form => ({...form, mssg: `passwords not match`}))
    } else if (target.oldPassword.value && (
      target.oldPassword.value === target.newPassword.value
    )) {
      setForm(form => ({...form, mssg: `same new password`}))
    } else {
      let updateFlag = false
      updateFlag = Object.keys(profile).some(key => profile[key] !== form[key])
      updateFlag = updateFlag || form.oldPassword
      if (updateFlag) {
        let newProfile = Object.keys(profile).reduce(
          (prev, curr) => ({...prev, [curr]: form[curr]})
        , {})
        if (form.oldPassword) {
          newProfile.userPassword = form.oldPassword
          newProfile.newPassword = form.newPassword
        }
        updateProfile(newProfile).then(([res, ok]) => {
          if (ok) {
            delete newProfile.userPassword
            delete newProfile.newPassword
            setForm({...newProfile, edit: false, mssg: ''})
            handler(newProfile)
          } else {
            setForm(form => ({...form, mssg: res.message || ''}))
          }
        })
      } else {
        setForm(form => ({...form, edit: false, mssg: ''}))
      }
    }
    event.preventDefault()
  }, [form, profile, handler, setForm])

  const handleInputChange = useCallback((event) => {
    let key = event.target.name
    let value = event.target.value.replace(/\s/g, '')
    setForm(form => ({...form, [key]: value}))
  }, [setForm])

  return <Panel style={{alignItems: 'start'}}>
    <form id={id} className='w-100 px-5 py-3 mb-3' onSubmit={saveChange}>
      <ProfileField
        name='userID'
        placeholder='Username'
        icon='mdi-account'
        value={profile.userID || ''}
        disabled
      />
      <ProfileField
        name='userRole'
        placeholder='Role'
        icon='mdi-tag'
        value={profile.userRole || ''}
        disabled
      />
      <ProfileField
        name='userEmail'
        placeholder='Email'
        icon='mdi-email'
        type='email'
        value={form.userEmail || ''}
        onChange={handleInputChange}
        disabled={!form.edit}
        required={true}
        minLength='8'
      />
      <ProfileField
        name='oldPassword'
        placeholder={(form.edit) ? 'Old Password' : 'Password'}
        icon='mdi-lock'
        type='password'
        value={(form.edit) ? (form.oldPassword || '') : 'XXXXXXXXXX'}
        onChange={handleInputChange}
        disabled={!form.edit}
        required={form.newPassword}
        minLength='6' maxLength='20'
      />
      {
        (form.edit) && (
          <>
            <ProfileField
              name='newPassword'
              placeholder='New Password'
              icon='mdi-key-variant'
              type='password'
              value={form.newPassword || ''}
              onChange={handleInputChange}
              minLength='6' maxLength='20'
            />
            <ProfileField
              name='confirmPassword'
              placeholder='Confirm Password'
              icon='mdi-key-chain-variant'
              type='password'
              value={form.confirmPassword || ''}
              onChange={handleInputChange}
              disabled={!form.edit}
              required={form.newPassword}
            />
          </>
        )
      }
      {(form.mssg) && <FormMessage className='d-block'>{form.mssg}</FormMessage>}
      {
        (!form.edit) ? (
          <Button
            type='button'
            onClick={editProfile}
            disabled={form.edit}
          >
            <i className='mdi mdi-pencil'></i> Edit
          </Button>
        ) : (
          <Button
            type='submit'
            disabled={!form.edit}
            form={id}
            color={'var(--color-success)'}
          >
            <i className='mdi mdi-content-save'></i> Save
          </Button>
        )
      }
    </form>
  </Panel> 
}

export default UserProfile