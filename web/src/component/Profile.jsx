import styled from 'styled-components'

import ToggleSwitch from './ToggleSwitch'

const Panel = styled.div`
  display: flex;
  flex-direction: column!important;
  flex: 1;
  color: var(--text-primary);
  align-items: center;
  background-color: var(--text-icon);
  border-radius: .5em;
  box-shadow: 0em .15em .5em rgba(0, 0, 0, .1);
  padding: 1em;
  margin: .5em;
  margin-bottom: 1em;
  @media only screen and (max-width: 560px) {
    margin: 1em .5em 0em .5em;
    padding: .5em;
  }
`

const ProfilePic = styled.img`
  display: block;
  width: 50%;
  height: auto;
  border: .5em solid transparent;
  border-color: rgba(0,0,0,0);
  border-radius: 50%;
  align-self: center;
  margin: 1.5em 0;
  &:hover {
    border-color: var(--color-primary-dark);
  }
`

const Tag = styled.code`
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  font-weight: 400;
  background-color: var(--color-${props => props.color || 'primary'});
  color: var(--color-white);
  padding: .1em .25em;
  border-radius: .25em;
`

const LogoutBtn = styled.button`
  font-size: .8em;
  font-weight: 700;
  border: none;
  border-radius: 3em;
  padding: .5em 1.6em;
  color: var(--text-icon);
  background-color: var(--color-danger);
  transition: all .1s;
  opacity: 1;
  &:hover {
    filter: brightness(75%);
  }
`

const Overview = ({ uid, role }) => (
  <Panel>
    <ProfilePic src={`https://identicon-api.herokuapp.com/${uid}/512?format=png`} />
    <h4>
      <code style={{color: 'var(--text-primary)'}}>{uid}</code>
    </h4>
    <p>role: <Tag color={(role === 'admin') ? 'purple' : 'danger'}>{role}</Tag></p>
  </Panel>
)

const Control = ({ handlers, ...props }) => (
  <Panel style={{fontSize: '1.2em'}}>
    <div className='mt-3'>
      <span style={{color: 'var(--color-primary)'}}>
        <i className='mdi mdi-white-balance-sunny'></i>
      </span>
      <ToggleSwitch
        checked={props.theme === 'dark'}
        handler={handlers.toggleTheme}
      />
      <span style={{color: 'var(--color-primary)'}}>
        <i className='mdi mdi-weather-night'></i>
      </span>
    </div>
    <div className='my-3'>
      <span style={{color: 'var(--color-primary)'}}>
        <i className='mdi mdi-format-font-size-decrease'></i>
      </span>
      <ToggleSwitch
        checked={props.fontSize === '150'}
        handler={handlers.toggleFontSize}
      />
      <span style={{color: 'var(--color-primary)'}}>
        <i className='mdi mdi-format-font-size-increase'></i>
      </span>
    </div>
    <div className='my-3'>
      <LogoutBtn onClick={handlers.handleLogout}>
        <i className='mdi mdi-logout'></i> Logout
      </LogoutBtn>
    </div>
  </Panel>
)

export { Control, Overview, Panel }