import { createContext, useContext, useReducer } from 'react'
import produce from 'immer'
import _ from 'lodash'

const Store = createContext()
Store.displayName = 'Store'

const useStore = () => useContext(Store)

const initialState = {
  theme: (
    (window.localStorage.getItem('theme')) 
    ? window.localStorage.getItem('theme')
    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  ),
  fontSize: (
    (window.localStorage.getItem('fontSize'))
    ? window.localStorage.getItem('fontSize')
    : 100
  ),
  data: {}
}

const reducer = (state=initialState, {key, value}) => {
  try {
    return produce(state, draft => _.set(draft, key, value))
  } catch (error) {
    console.log(error)
    return state
  }
}

const StoreProvider = ({ children }) => {
  const [globalState, dispatch] = useReducer(reducer, initialState)
  return <Store.Provider value={[globalState, dispatch]}>
    {children}
  </Store.Provider>
}

export {
  useStore,
  StoreProvider
}