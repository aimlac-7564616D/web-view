import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FormContainer from "../component/FormContainer";

const Email = styled.a`
  color: var(--color-primary);
  text-decoration: none;
  &:hover {
    color: var(--color-primary-dark);
  }
  font-weight: 400;
`

const HomePage = styled.button`
  background-color: var(--text-icon);
  border-color: var(--color-primary);
  border-radius: 0.25em;
  border: 0.1em solid transparent;
  color: var(--color-primary);
  font-weight: 700;
  padding: .25em 1em;
  transition: all .1s;
  &:hover {
    background-color: var(--color-primary);
    color: var(--text-icon);
  }
`

const PostRegister = () => {
  useEffect(() => {
    document.title = 'post-register'
  }, [])
  const navigate = useNavigate()
  return <FormContainer>
    <h3>Registration Complete</h3>
    <hr />
    <p>
      Your registration will be approved by the administrator within X working days.
      If you have any questions, please email the administrator
      at <Email href='mailto:fake@email.com'>fake@email.com</Email>.
    </p>
    <div className='d-flex justify-content-end p-0' style={{marginTop: '2.5em'}}>
      <HomePage onClick={() => navigate('/')}>
        <i className="mdi mdi-home"></i> Home
      </HomePage>
    </div>
  </FormContainer>
}

export default PostRegister