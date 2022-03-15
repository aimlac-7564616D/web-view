import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Icon = styled.p`
  font-size: 5em;
  margin: 0;
  padding: 0;
`

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

const Button = styled.button`
  display: block;
  margin: 0 1.5em;
  margin-top: 1em;
  background-color: var(--background);
  padding: 0.25em 1em 0.25em 1em;
  border: 0.2em solid transparent;
  border-color: var(--color-primary);
  border-radius: .5em;
  color: var(--color-primary);
  font-size: 1em;
  transition: background-color .1s;
  text-decoration: none;
  &:hover {
    background-color: var(--color-primary);
    color: var(--text-icon);
  }
`

const Error = () => {
  useEffect(() => {
    document.title = 'error'
  }, [])
  const navigate = useNavigate()

  const refreshPage = useCallback(() => window.location.reload(false), [])
  const backToHome = useCallback(() => navigate('/'), [navigate])

  return <div className='container-fluid g-0'>
    <div className='row g-0'>
      <div className='col-md-12'>
        <Container>
          <Icon className='mdi mdi-alert-octagon'></Icon>
          <h2>Oops!</h2>
          <p>
            Something went wrong <i className='mdi mdi-emoticon-sad'></i>, please try again!
          </p>
          <div className='d-inline-flex flex-row justify-content-right'>
            <Button onClick={refreshPage}><i className='mdi mdi-restart'></i> Refresh</Button>
            <Button onClick={backToHome}><i className='mdi mdi-home'></i> Home</Button>
          </div>
        </Container>
      </div>
    </div>
  </div>  
}

export default Error