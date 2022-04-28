import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Account from './page/Account'
import Dashboard from './page/Dashboard'
import DashboardBase from './page/DashboardBase'
import Login from './page/Login'
import NotFound from './page/NotFound'
import Order from './page/Order'
import PostRegister from './page/PostRegister'
import Register from './page/Register'

import PrivateRoute from './helper/PrivateRoute'
import SpecialRoute from './helper/SpecialRoute'
import { useStore } from './helper/Store'

const App = () => {
  const [globalState, ] = useStore()
  document.body.dataset.theme = globalState.theme
  document.body.style.setProperty('font-size', `${globalState.fontSize}%`)
  return <BrowserRouter>
    <div className='container-fluid g-0'>
      <Routes>
        <Route index element={<Navigate to='/dashboard' replace />} />
        <Route exact path='login' element={
          <SpecialRoute><Login /></SpecialRoute>
        } />
        <Route exact path='register' element={<Register />} />
        <Route exact path='register/complete' element={<PostRegister />} />
        <Route exact path='dashboard' element={
          <PrivateRoute><DashboardBase /></PrivateRoute>
        }>
          <Route index element={<Navigate to='/dashboard/weather' replace />} />
          <Route path='weather' element={<Dashboard tag='weather' />} />
          <Route path='electricity' element={<Dashboard tag='electricity' />} />
          <Route path='co2' element={<Dashboard tag='co2' />} />
          <Route path='price' element={<Dashboard tag='price' />} />
          <Route path='order' element={<Order />} />
          <Route path='account' element={<Account />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route exact path='*' element={<NotFound />} />
      </Routes>
    </div>
  </BrowserRouter>
}

export default App