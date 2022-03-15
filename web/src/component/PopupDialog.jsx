import styled from "styled-components"
import { FormButton } from "./FormItems"

const ModalDialog = styled.div`
  margin: 1.75em auto;
  @media only screen and (max-width: 560px) {
    margin: 0.5em;
  }
  .modal-content {
    width: 100%;
    background-color: var(--background);
    color: var(--text-primary);
  }
  .modal-header {
    button {
      background-color: var(--color-danger);
      opacity: 1;
      transition: all .1s;
    }
    button:hover {
      filter: brightness(75%);
    }
  }
`

const PopupDialog = ({id, header, children, handleConfirm}) => (
  <div
    className='modal fade'
    id={id}
    tabIndex='-1'
    aria-hidden='false'
    style={{width: '100vw', margin: '0 auto'}}
  >
    <ModalDialog className='modal-dialog modal-lg'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h5 className='modal-title'>{header}</h5>
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='modal'
            aria-label='close'
          ></button>
        </div>
        <div className='modal-body px-4'>{children}</div>
        <div className='modal-footer p-0'>
          <FormButton
            type='button'
            className='btn m-2 py-1 px-4'
            data-bs-dismiss='modal'
            onClick={handleConfirm}
          >
            Confirm
          </FormButton>
        </div>
      </div>
    </ModalDialog>
  </div>
)

export default PopupDialog