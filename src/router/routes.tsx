import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/analytics/Analytics";
import Events from "../pages/events/Events";
import Users from "../pages/users/Users";
import Schools from "../pages/schools/Schools";
import Associations from "../pages/associations/Associations";
import Students from "../pages/students/Students";
import Hobbies from "../pages/students/Hobbies";
import Documentation from "../pages/Documentation";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { useAuth } from "../context/AuthContext";
import type { UserProfile } from "../api";


function LoginRoute() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  return (
    <LoginPage
      onLogin={(user: UserProfile) => { setUser(user); navigate('/'); }}
      onSwitchToRegister={() => navigate('/register')}
    />
  );
}

function RegisterRoute() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  return (
    <RegisterPage
      onRegister={(user: UserProfile) => { setUser(user); navigate('/'); }}
      onSwitchToLogin={() => navigate('/login')}
    />
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<LoginRoute />} />
      <Route path='/register' element={<RegisterRoute />} />
      <Route path='/' element={<Home />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/analytics' element={<Analytics />} />
      <Route path='/events' element={<Events />} />
      <Route path='/users' element={<Users />} />
      <Route path='/schools' element={<Schools />} />
      <Route path='/associations' element={<Associations />} />
      <Route path='/students' element={<Students />} />
      <Route path='/hobbies' element={<Hobbies />} />
      <Route path='/documentation' element={<Documentation />} />
    </Routes>
  )
}

export default AppRoutes;