import { useEffect } from 'react'
import styled from 'styled-components'

const Spinner = styled.div`
  color: var(--color-primary);
  font-size: 5em;
  min-height: 2em;
  min-width: 2em;
`

const Loading = () => {
  useEffect(() => {
    document.title = 'loading'
  }, [])
  
  return <div
    className='d-flex justify-content-center'
    style={{height: '100vh'}}
  >
    <Spinner className='spinner-border align-self-center' />
  </div>
}

export default Loading