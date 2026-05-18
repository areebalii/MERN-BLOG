import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPrivateRoute from './components/AdminProtectedRoute';
import Layout from './components/Layout';
import Categories from './pages/Categories';
import AllPosts from './pages/AllPosts';
// import PostDetail from './pages/PostDetail';

function App() {
  // Check if admin exists in localStorage
  const adminUser = JSON.parse(localStorage.getItem('adminUser'));

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect Root Path Logic */}
        <Route
          path="/"
          element={adminUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminPrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/posts" element={<AllPosts />} />
          </Route>
        </Route>

        {/* Catch-all: If user enters any wrong URL, send them to login or dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;