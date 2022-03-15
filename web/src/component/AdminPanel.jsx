import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import _ from 'lodash'

import { deleteUser, fetchAllUsers, updateUserRole } from '../service/accountService'
import { Panel } from './Profile'

const ProfilePic = styled.img`
  display: inline-block;
  width: 100%;
  border-radius: 50%;
  border: .15em solid transparent;
  border-color: rgba(0,0,0,0);
  transition: border-color .2s;
`

const CenterBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`

const Card = styled.div`
  padding: 1em 2.5em;
  opacity: .8;
  transition: transform .2s, opacity .2s, font-size .2s;
  &:hover {
    font-size: 1.2em;
    transform: scale(1.05, 1.05);
    opacity: 1;
  }
  &:hover > div > img {
    border-color: var(--color-primary-dark);
  }
  @media only screen and (max-width: 560px) {
    padding: 1em 1em;
  }
`

const UID = styled.p`
  margin: 0 0 .25em 0;
  padding: 0;
  color: var(--text-primary);
  font-weight: 400;
  line-height: 1em;
  font-size: 1em;
`

const Email = styled.a`
  margin: 0;
  padding: 0;
  text-decoration: none;
  line-height: .9em;
  font-size: .9em;
  font-weight: 700; 
  color: var(--color-primary);
  transition: filter .2s;
  &:hover {
    color: var(--color-primary);
    filter: brightness(60%);
  }
  &:focus {
    color: var(--color-primary);
  }
`

const Tag = styled.p`
  display: inline;
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
  monospace;
  margin: .5em 0 0 0;
  line-height: .8em;
  font-size: .8em;
  font-weight: 700;
  margin-right: auto;
  background-color: var(--color-${props => props.color || 'primary'});
  color: var(--color-white);
  padding: .3em .3em;
  border-radius: .25em;
`

const Button = styled.button`
  display: block;
  flex: 0 0 auto;
  background-color: var(--color-${props => props.color || 'primary'});
  border: none;
  border-radius: .3em;
  color: var(--text-icon);
  font-size: 1.2em;
  font-weight: 700;
  height: 2.5em;
  width: 2.5em;
  margin: 0 .1em;
  transition: all .1s, transform .3s;
  &:hover {
    color: var(--text-icon);
    filter: brightness(75%); 
  }
  &:focus {
    background-color: var(--color-${props => props.color || 'primary'});
    outline: none;
    box-shadow: none;
  }
  &:disabled {
    background-color: var(--color-grey);
  }
  @media only screen and (max-width: 560px) {
    height: 2em;
    width: 2em;
  }
`

const Rail = styled.div`
  ${Button} {
    transform: translate(4.75em);
    @media only screen and (max-width: 560px) {
      transform: translate(4.25em);
    }
  }
  [data-confirm]& > ${Button} {
    transform: translate(-4.75em);
    @media only screen and (max-width: 560px) {
      transform: translate(-4.25em);
    }
  }
`

const IconButton = ({ icon, ...props }) => (
  <Button className={`mdi mdi-${icon}`} {...props} />
)

const UserCard = ({ profile, setUpdateFlag }) => {
  const [buttonIds, ] = useState({
    makeAdmin: _.uniqueId('btn'),
    revokeAdmin: _.uniqueId('btn'),
    approve: _.uniqueId('btn'),
    reject: _.uniqueId('btn'),
    confirmYes: _.uniqueId('btn'),
    confirmNo: _.uniqueId('btn')
  })
  const [railId, ] = useState(_.uniqueId('rail'))
  const [pending, setPending] = useState(false)
  const [action, setAction] = useState(null)

  const onClick = useCallback((event) => {
    const id = event.target.id
    // prevent spam
    const controlButtons = (enable=true) => {
      Object.values(buttonIds).forEach(v => {
        let button = document.querySelector(`#${v}`)
        if (button && !enable)
          button.setAttribute('disabled', 'disabled')
        if (button && enable)
          button.removeAttribute('disabled')
      })
    }
    controlButtons(false)

    const rail = document.querySelector(`#${railId}`)
    let executeFlag = false
    switch (id) {
      case buttonIds.makeAdmin:
        setPending(true)
        rail.setAttribute('data-confirm', 'data-confirm')
        setAction(['update', 'admin'])
        break
      case buttonIds.revokeAdmin:
        setPending(true)
        rail.setAttribute('data-confirm', 'data-confirm')
        setAction(['update', 'non-admin'])
        break
      case buttonIds.approve:
        setPending(true)
        rail.setAttribute('data-confirm', 'data-confirm')
        setAction(['update', 'non-admin'])
        break
      case buttonIds.reject:
        setPending(true)
        rail.setAttribute('data-confirm', 'data-confirm')
        setAction(['delete'])
        break
      case buttonIds.confirmYes:
        setPending(false)
        executeFlag = true
        break
      case buttonIds.confirmNo:
        setPending(false)
        executeFlag = false
        rail.removeAttribute('data-confirm')
        controlButtons(true)
        setAction(null)
        break
      default:
        break
    }

    const resetProcedure = () => {
      controlButtons(true)
      rail.removeAttribute('data-confirm')
      setAction(null)
    }

    if (executeFlag && action) {
      let callback = (action[0] === 'update')
        ? (id) => updateUserRole(id, action[1])
        : (id) => deleteUser(id)

      callback(profile.userID).then(ok => {
        resetProcedure()
        if (ok) setUpdateFlag(flag => !flag)
      }).catch(err => {
        console.log(err)
        resetProcedure()
      })
    } else { controlButtons(true) }
  }, [profile, action, buttonIds, railId, setAction, setPending, setUpdateFlag])

  return <Card className='row'>
    <CenterBox className='col-2'>
      <ProfilePic
        alt='profile-pic'
        src={`https://identicon-api.herokuapp.com/${profile.userID}/512?format=png`}
      />
    </CenterBox>
    <div className='col-6 d-flex flex-column justify-content-center overflow-scroll'>
      <UID>{profile.userID}</UID>
      <Email href={`mailto:${profile.userEmail}`}>{profile.userEmail}</Email>
      <Tag color={{
        'admin': 'purple',
        'non-admin': 'danger',
        'pending': 'grey'
        }[profile.userRole]}
      >{profile.userRole}</Tag>
    </div>
    <div className='col-4 d-flex flex-column align-items-center p-0 overflow-hidden'>
      <code className='m-0 mb-2' style={{color: 'var(--color-primary)'}} >/{
        (pending) ? 'confirm' : (
          {
            'admin': 'revoke-admin',
            'non-admin': 'make-admin',
            'pending': 'approve'
          }[profile.userRole]
        )
      }</code>
      <Rail id={railId} className='d-flex flex-row overflow-hidden'>
        {
          (profile.userRole === 'pending') ? (
            <IconButton
              id={buttonIds.approve}
              onClick={onClick}
              icon='check-circle-outline'
              color='success' />
          ) : (
            <IconButton
              id={(profile.userRole === 'admin') ? buttonIds.revokeAdmin : buttonIds.makeAdmin}
              onClick={onClick}
              icon='sync'
              color={
                (profile.userRole === 'admin') ? 'blue' : 'purple'
              } />
          )
        }
        <IconButton
          id={buttonIds.reject}
          onClick={onClick}
          icon='trash-can'
          color='danger'
        />
        <div style={{width: '5em'}}></div>
        <IconButton
          id={buttonIds.confirmYes}
          onClick={onClick}
          icon='check'
          color='success'
        />
        <Button
          id={buttonIds.confirmNo}
          onClick={onClick}
          color='danger'
        >×</Button>
      </Rail>
    </div>
  </Card>
}

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [updateFlag, setUpdateFlag] = useState(false)
  useEffect(() => {
    fetchAllUsers().then(({users, ok}) => {
      setUsers(users)
    })
  }, [updateFlag, setUpdateFlag])

  return <Panel>
    {
      users.map((user, key) => <UserCard
        key={key}
        profile={user}
        setUpdateFlag={setUpdateFlag}
      />)
    }
    { (!users.length) && <code>(0) users</code> }
  </Panel>
}

export default AdminPanel