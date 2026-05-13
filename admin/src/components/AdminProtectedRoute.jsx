import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoute = () => {
  // Pull user from localStorage
  const adminUser = JSON.parse(localStorage.getItem('adminUser'));

  // Verify user exists and is an admin
  return adminUser && adminUser.role === 'admin' ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminPrivateRoute;