import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

const SideNavBar = styled.div`
  background-color: var(--color-primary-dark);
  color: var(--text-icon);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  position: fixed;
  transition: width .2s;
  width: 16em;
  z-index: 99;
  &.toggle {
    @media only screen and (max-width: 560px) {
      width: 0;
    }
  }
`

const Item = styled(Link)`
  color: var(--text-icon);
  cursor: pointer;
  display: block;
  font-size: 1.2em;
  font-weight: 400;
  padding: 1em;
  text-decoration: none;
  transition: background-color .2s;
  width: 16em;
  overflow: hidden;
  i { padding: 0 .5em 0 0; }
  &:hover {
    color: var(--text-icon);
    background-color: var(--color-primary);
  }
  &.active {
    pointer-events: none;
    background-color: var(--color-primary);
  }
`

const NavItem = ({children, ...props}) => {
  const location = useLocation()
  const className = (location.pathname === props.to) ? 'active' : ''
  return <Item className={className} {...props}>{children}</Item>
}

const NavBar = ({id}) => (
  <SideNavBar id={id}>
    <p  
      className='mx-auto mt-3 mb-3 py-2 px-3'
      style={{
        fontSize: '2em', fontWeight: 300,
        border: '.05em solid', borderRadius: '.25em'
      }}
    >
      7564616D
    </p>
    <hr className='m-0' />
    <ul className='nav flex-column mb-auto'>
      <NavItem to='/dashboard/weather'>
        <i className='mdi mdi-weather-partly-cloudy'></i> Weather
      </NavItem>
      <NavItem to='/dashboard/electricity'>
        <i className='mdi mdi-lightning-bolt'></i> Electricity
      </NavItem>
      <NavItem to='/dashboard/co2'>
        <i className='mdi mdi-molecule-co2'></i> Carbon Dioxide
      </NavItem>
      <NavItem to='/dashboard/price'>
        <i className='mdi mdi-chart-areaspline'></i> Price
      </NavItem>
    </ul>
    <hr className='mb-0' />
    <NavItem to='/dashboard/account'>
      <i className='mdi mdi-account-circle'></i> Account
    </NavItem>
  </SideNavBar>
)

export default NavBar