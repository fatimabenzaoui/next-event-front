import { Box, Typography, Avatar } from '@mui/material';
import { useProSidebar , Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined';
import { Link, useLocation } from 'react-router-dom';
import defaultAvatar from '../assets/default-avatar.png';
import { useAuth } from '../context/AuthContext';

export default function SideNav() {

  const { collapsed } = useProSidebar();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <Sidebar
      style={{
        height: '100%',
        top: 'auto'
      }}
      breakPoint='md'
      backgroundColor='rgba(239, 236, 236, 1)'
    >

      <Box sx={styles.avatarContainer}>
        <Avatar
          sx={styles.avatar}
          alt={user?.first_name || ''}
          src={defaultAvatar}
        />
        {!collapsed && user ? (
          <>
            <Typography variant="body2" sx={styles.name}>
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="overline" sx={styles.role}>
              ROLE : {user.role}
            </Typography>
          </>
        ) : null}
      </Box>

      <Menu
        menuItemStyles={{
          button: ({ active }) => {
            return {
              backgroundColor: active ? '#9C27B0' : 'transparent',
              color: active ? '#FFF' : '#000'
            }
          }
        }}>
        <MenuItem 
          active={location.pathname === '/dashboard'} 
          component={<Link to="/dashboard"/>} 
          icon={<DashboardOutlinedIcon/>}
        >
          <Typography variant="body2">Dashboard</Typography>
        </MenuItem>
        <MenuItem 
          active={location.pathname === '/analytics'}  
          component={<Link to="/analytics"/>} 
          icon={<AnalyticsOutlinedIcon />}
        >
          <Typography variant="body2">Analytics</Typography>
        </MenuItem>
        <MenuItem 
          active={location.pathname === '/events'} 
          component={<Link to="/events"/>}
          icon={<CalendarMonthOutlinedIcon />}
        >
          <Typography variant="body2">Events</Typography>
        </MenuItem>
        <MenuItem
          active={location.pathname === '/users'}
          component={<Link to="/users"/>}
          icon={<GroupOutlinedIcon />}
        >
          <Typography variant="body2">Users</Typography>
        </MenuItem>
        <MenuItem
          active={location.pathname === '/schools'}
          component={<Link to="/schools"/>}
          icon={<SchoolOutlinedIcon />}
        >
          <Typography variant="body2">Schools</Typography>
        </MenuItem>
        <MenuItem
          active={location.pathname === '/associations'}
          component={<Link to="/associations"/>}
          icon={<PeopleOutlinedIcon />}
        >
          <Typography variant="body2">Associations</Typography>
        </MenuItem>
        <MenuItem
          active={location.pathname === '/students'}
          component={<Link to="/students"/>}
          icon={<PersonOutlinedIcon />}
        >
          <Typography variant="body2">Students</Typography>
        </MenuItem>
        <MenuItem
          active={location.pathname === '/hobbies'}
          component={<Link to="/hobbies"/>}
          icon={<InterestsOutlinedIcon />}
        >
          <Typography variant="body2">Hobbies</Typography>
        </MenuItem>
        <MenuItem 
          active={location.pathname === '/documentation'} 
          component={<Link to="/documentation"/>}
          icon={<SourceOutlinedIcon />}
        >
          <Typography variant="body2">Documentation</Typography>
        </MenuItem>
      </Menu>
    </Sidebar>
  )
}

/** @type {import("@mui/material").SxProps} */
const styles = {
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    my: 5
  },
  avatar: {
    width: '40%',
    height: 'auto'
  },
  name: {
    fontWeight: 'bold !important',
    mt: 1
  },
  role: {
    color: 'rgba(0, 0, 0, 0.54)',
  }
}