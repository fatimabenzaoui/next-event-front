import { AppBar, Toolbar, IconButton, Box, Badge, Link } from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useProSidebar } from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';

export default function TopNav() {

  const { collapseSidebar, toggleSidebar, broken } = useProSidebar()

  return (
  <AppBar position="sticky" sx={styles.topBar}>
    <Toolbar>
      <IconButton onClick={()=>broken ? toggleSidebar() : collapseSidebar()} color="secondary">
        <MenuTwoToneIcon />
      </IconButton>

      <Box sx={styles.nextEventTitle}>
        Next Event
      </Box>

      <Box sx={{flexGrow: 1}} />

      <IconButton title='Home' color='secondary' component={NavLink} to="/">
          <HomeIcon />
        </IconButton>

      <IconButton title='Home' color='secondary' component={NavLink} to="/profile">
        <AccountCircleIcon />
      </IconButton>

      <IconButton title='Notifications' color="secondary">
        <Badge badgeContent={4} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <IconButton title='Settings' color='secondary' component={NavLink} to="/dashboard">
        <SettingsIcon />
      </IconButton>

      <IconButton title='Sign Out' color='secondary'>
        <LogoutIcon />
      </IconButton>
    </Toolbar>
  </AppBar>)
}

/** @type {import("@mui/material").SxProps} */
const styles = {
  topBar: {
    backgroundColor: '#010006ff'
  },
  logo: {
    width: '80',
    cursor: 'pointer',
    ml: 2
  },
  nextEventTitle: {
    fontFamily: 'Holtwood One SC',
    color: '#9C27B0',
    textShadow: '2px 2px #FFF',
    fontSize: '30px',
    display: { xs: 'none', sm: 'block' }
  }
}