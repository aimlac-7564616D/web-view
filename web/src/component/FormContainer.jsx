import '@mdi/font/css/materialdesignicons.min.css'
import styled from 'styled-components'

const ResponsiveBox = styled.div`
  border-radius: 0.5em;
  margin-bottom: 3em;
  margin-top: 3.5em;
  overflow: hidden;
  width: calc(560px * 0.9);
  box-shadow: 0 .5em 1em rgba(0, 0, 0, .15);
  @media only screen and (max-width: 560px) {
    margin-top: 1.5em;
    width: 90vw;
  }
`

const Banner = styled.div`
  background-color: var(--color-primary);
  height: 20vh;
  width: 100%;
`

const BannerIcons = styled.div`
  bottom: 0;
  color: var(--text-icon);
  display: inline-block;
  font-size: 1.5em;
  margin-bottom: 0.25em;
  margin-right: 0.75em;
  position: absolute;
  right: 0;
`
const Container = styled.div`
  background-color: var(--text-icon);
  color: var(--text-primary);
  font-weight: 300;
  padding-bottom: 1.5em;
  padding: 3em;
  h3 { font-weight: 300; }
`

const FormContainer = ({children}) => (
  <div className='d-flex justify-content-center'>
    <ResponsiveBox>
      <div className='d-flex' style={{position: 'relative'}}>
        <Banner />
        <BannerIcons>
          <i className="mdi mdi-weather-windy" />
          <i className="mdi mdi-wind-turbine" />
          <i className="mdi mdi-white-balance-sunny" />
          <i className="mdi mdi-solar-panel" />
          <i className="mdi mdi-lightning-bolt" />
          <i className="mdi mdi-database" />
          <i className="mdi mdi-chart-line" />
          <i className="mdi mdi-desktop-mac-dashboard" />
        </BannerIcons>
      </div>
      <Container>
        {children}
      </Container>
    </ResponsiveBox>
  </div>
)
export default FormContainer