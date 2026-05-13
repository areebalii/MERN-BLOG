import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './layout/Layout'
import { RouteAddCategory, RouteCategoryDetails, RouteEditCategory, RouteIndex, RouteProfile, RouteSignIn, RouteSignUp } from './helper/RouteName'
import Index from './pages/Index'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Profile from './pages/Profile'
import CategoryDetails from './pages/category/CategoryDetails'
import AddCategory from './pages/category/AddCategory'
import EditCategory from './pages/category/EditCategory'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route path={RouteIndex} element={<Layout />}>
            <Route index element={<Index />} />
            <Route path={RouteProfile} element={<Profile />} />
            <Route path={RouteCategoryDetails} element={<CategoryDetails />} />
            <Route path={RouteAddCategory} element={<AddCategory />} />
            <Route path={RouteEditCategory()} element={<EditCategory />} /> 
          </Route>

          <Route path={RouteSignIn} element={<Signin />} />
          <Route path={RouteSignUp} element={<Signup />} />

        </Routes>
     </BrowserRouter>
   </>
  )
}

export default App
