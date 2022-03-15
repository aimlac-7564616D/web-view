import styled from 'styled-components'
import {
  FormButton,
  FormInput,
  FormMessage,
  ShowPassword,
  StyledLink
} from './FormItems'

const TermCheckbox = styled.div`
  color: var(--color-primary);
  input {
    background-color: var(--text-icon);
    border-color: var(--text-primary);
  }
  label {
    color: var(--color-primary-dark);
    font-weight: 400;
  }
  input, label {
    cursor: pointer;
  }
  input:checked {
    background-color: var(--color-primary);
    border-width: 0;
  }
`

const RegisterForm = ({data, policyId, handlers}) => (
  <form className='py-3' onSubmit={handlers.handleSubmit}>
    <FormInput
      id='user'
      name='user'
      type='text'
      placeholder='Username'
      value={data.user}
      onChange={handlers.handleInput}
      minLength='4'
      maxLength='20'
      required
    />
    <ShowPassword
      id='pass'
      name='pass'
      placeholder='Password'
      value={data.pass}
      onChange={handlers.handleInput}
      minLength='6'
      maxLength='20'
      required
    />
    <TermCheckbox className='text-center mb-4'>
      <input
        className='form-check-input'
        type='checkbox'
        name='agree'
        id='agree'
        checked={data.agree}
        onChange={handlers.handleCheck}
        required
      />
      <label className='form-check-label px-2' htmlFor='agree'>
        I accept the <StyledLink to='#' data-bs-toggle='modal' data-bs-target={`#${policyId}`}>
          privacy policy
        </StyledLink>
      </label>
    </TermCheckbox>
    <FormButton type='submit' className='form-control mt-2'>
      Submit
    </FormButton>
    {data.mssg && <FormMessage>{data.mssg}</FormMessage>}
    <div className='text-center mt-4'>
      Already have an account? <StyledLink to="/login">Login here</StyledLink>
    </div>
  </form>
)

export default RegisterForm