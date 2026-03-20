import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/analytics/Analytics";
import Events from "../pages/events/Events";
import Users from "../pages/users/Users";
import Schools from "../pages/schools/Schools";
import Associations from "../pages/associations/Associations";
import Students from "../pages/students/Students";
import Documentation from "../pages/Documentation";

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/analytics' element={<Analytics />} />
      <Route path='/events' element={<Events />} />
      <Route path='/users' element={<Users />} />
      <Route path='/schools' element={<Schools />} />
      <Route path='/associations' element={<Associations />} />
      <Route path='/students' element={<Students />} />
      <Route path='/documentation' element={<Documentation />} />
    </Routes>
  )
}

export default AppRoutes;