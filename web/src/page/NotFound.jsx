import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  min-width: calc(100% - 16em);
  overflow: hidden;
  padding: 2.5em 0;
  text-align: center;
  color: var(--text-primary);
  h1 { font-weight: 400; }
  h2 { font-weight: 300; }
  p { font-weight: 300; }
  @media only screen and (max-width: 560px) {
    width: calc(100vw - 1em);
  }
`

const HomeButton = styled(Link)`
  background-color: var(--background);
  padding: 0.25em 1em 0.25em 1em;
  border: 0.2em solid transparent;
  border-radius: .5em;
  border-color: var(--color-primary);
  color: var(--color-primary);
  font-size: 1em;
  transition: background-color .1s;
  text-decoration: none;
  &:hover {
    background-color: var(--color-primary);
    color: var(--text-icon);
  }
`

const NotFound = () => {
  useEffect(() => {
    document.title = '404 not found'
  }, [])
  
  return <div className='container-fluid g-0'>
    <div className='row g-0'>
      <div className='col-md-12'>
        <Container>
          <h1>Oops!</h1>
          <h2>404 Not Found</h2>
          <p>
            Sorry, an error has occured. Requested page not found!
          </p>
          <HomeButton to='/'><i className='mdi mdi-home'></i> Home</HomeButton>
        </Container>
      </div>
    </div>
  </div>  
}

export default NotFound