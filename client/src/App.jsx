import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './layout/Layout'
import { RouteIndex, RouteSignIn, RouteSignUp } from './helper/RouteName'
import Index from './pages/Index'
import Signup from './pages/Signup'
import Signin from './pages/Signin'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route path={RouteIndex} element={<Layout />}>
            <Route index element={<Index />} />
          </Route>

          <Route path={RouteSignIn} element={<Signin />} />
          <Route path={RouteSignUp} element={<Signup />} />

        </Routes>
     </BrowserRouter>
   </>
  )
}

export default App
