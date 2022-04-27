import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

import NavBar from '../component/NavBar'

const Container = styled.div`
  display: block;
  margin-left: 16em;
  transition: margin 0.2s;
  &.toggle {
    @media only screen and (max-width: 560px) {
      margin-left: 0;
    }
  }
`

const CloseButton = styled.button`
  display: block;
  background-color: var(--color-primary-dark);
  position: sticky;
  top: 0;
  left: 0;
  color: var(--text-icon);
  font-size: 1em;
  z-index: 999;
  border: none;
  border-radius: 0 0 .5em 0;
  padding-right: .5em;
  width: 2.1em;
  height: 0;
  visibility: hidden;
  @media only screen and (max-width: 560px) {
    height: 2.1em;
    font-size: 1.5em;
    visibility: visible;
  }
`

const Content = styled.div`
  margin: 0;
  padding: 1em;
  width: 100%;
  overflow: scroll;
  @media only screen and (max-width: 560px) {
    padding: 0.5em;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`

const DashboardBase = () => {
  const [navBarId, ] = useState(_.uniqueId('sidebar'))
  const [containerId, ] = useState(_.uniqueId('container'))

  useEffect(() => {
    document.title = 'dashboard'
  }, [])

  const toggleNavBar = useCallback((event) => {
    event.target.classList.toggle('mdi-close')
    event.target.classList.toggle('mdi-menu')
    document.querySelector(`#${navBarId}`).classList.toggle('toggle')
    document.querySelector(`#${containerId}`).classList.toggle('toggle')
  }, [navBarId, containerId])

  return <>
    <NavBar id={navBarId} />
    <Container id={containerId}>
      <CloseButton onClick={toggleNavBar} className='mdi mdi-close'>
        <span className='visually-hidden'>close menu</span>
      </CloseButton>
      <Content><Outlet /></Content>
    </Container>
  </>
}

export default DashboardBase