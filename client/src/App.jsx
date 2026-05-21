import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './layout/Layout'
import { RouteCreatePost, RouteIndex, RouteProfile, RouteSignIn, RouteSignUp } from './helper/RouteName'
import Index from './pages/Index'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
// 1. Import your new Post Detail page
import PostDetail from './pages/PostDetail'
import UpdatePost from './components/UpdatePost'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Main Content Layout */}
          <Route path={RouteIndex} element={<Layout />}>
            <Route index element={<Index />} />
            <Route path={RouteProfile} element={<Profile />} />
            <Route path={RouteCreatePost} element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />

            {/* 2. ADD THIS LINE: It allows the URL /post/whatever-slug to work */}
            <Route path="/post/:slug" element={<PostDetail />} />
          </Route>

          <Route path={RouteSignIn} element={<Signin />} />
          <Route path={RouteSignUp} element={<Signup />} />

          {/* 3. OPTIONAL: A catch-all for 404 errors */}
          <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App