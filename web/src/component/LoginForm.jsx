import styled from 'styled-components'
import {
  FormButton,
  FormInput,
  FormMessage,
  ShowPassword,
  StyledLink
} from './FormItems'

const OptionGroup = styled.div`
  display: flex;
  flex-direction: row !important;
  margin-bottom: 0;
  margin-top: 1.5em !important;
  @media only screen and (max-width: 560px) {
    flex-direction: column !important;
  }
`

const RmbMeCheckbox = styled.div`
  flex: 1 0 0%;
  color: var(--color-primary);
  font-weight: 400;
  text-align: left !important;
  input {
    background-color: var(--text-icon);
    border-color: var(--text-primary);
    cursor: pointer;
  }
  label { cursor: pointer; }
  input:checked {
    background-color: var(--color-primary);
  }
  @media only screen and (max-width: 560px) {
    text-align: center !important;
  }
`

const FgtPassLink = styled.div`
  text-align: right !important;
  @media only screen and (max-width: 560px) {
    margin-bottom: 1em;
    text-align: center !important;
  }
`

const LoginForm = ({data, handlers}) => (
  <form className='py-3' onSubmit={handlers.handleSubmit}>
    <FormInput
      id='user'
      name='user'
      type='text'
      placeholder='Username'
      value={data.user}
      onChange={handlers.handleInput}
      required
    />
    <ShowPassword
      id='pass'
      name='pass'
      placeholder='Password'
      value={data.pass}
      onChange={handlers.handleInput}
      required
    />
    <FormButton type='submit' className='form-control mt-2'>
      Login
    </FormButton>
    {data.mssg && <FormMessage>{data.mssg}</FormMessage>}
    <OptionGroup>
      <RmbMeCheckbox>
        <input
          className='form-check-input'
          type='checkbox'
          name='rmb-me'
          id='rmb-me'
          checked={data.rmbMe}
          onChange={handlers.handleRmbMe}
        />
        <label className='form-check-label px-2' htmlFor='rmb-me'>Remember me</label>
      </RmbMeCheckbox>
      <FgtPassLink className='col'>
        <StyledLink to='#'>Forgot Password</StyledLink>
      </FgtPassLink>
    </OptionGroup>
    <div className='text-center mt-4'>
      Not registered? <StyledLink to='/register'>Create an account</StyledLink>
    </div>
  </form>
)

export default LoginForm