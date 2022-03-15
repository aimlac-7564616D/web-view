import styled from "styled-components"

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: .25em;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0;
  background-color: var(--text-icon);
  border: .1em solid transparent;
  border-color: var(--color-primary);
  border-radius: 1em;
  height: 100%;
  transition: .2s;
  &:before {
    position: absolute;
    content: "";
    height: .6em;
    width: .6em;
    left: .1em;
    bottom: .1em;
    background-color: var(--color-primary);
    border: 0;
    border-radius: 50%;
    transition: transform .2s;
  }
`

const Switch = styled.label`
  display: inline-block;
  position: relative;
  width: 2em;
  height: 1em;
  margin: 0 .5em;
  padding: 0;
  input {
    opacity: 0;
    height: 0;
    width: 0;
  }
  input:checked + ${Slider} {
    background-color: var(--color-primary);
  }
  input:checked + ${Slider}:before {
    background-color: var(--text-icon);
    transform: translateX(1em);
  }
`

const ToggleSwitch = ({checked, handler}) => (
  <Switch>
    <input type='checkbox' checked={checked} onChange={handler} />
    <Slider />
  </Switch>
)

export default ToggleSwitch