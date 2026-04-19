import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useProSidebar } from 'react-pro-sidebar';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopNav() {

  const { collapseSidebar, toggleSidebar, broken } = useProSidebar();
  const { logout, user } = useAuth(); // Récupère l'utilisateur
  const navigate = useNavigate();

  // Vérifie si l'utilisateur a le rôle 'association'
  const isAssociation = user?.role === 'association';

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

      {/* {user && (
        <IconButton title='Home' color='secondary' component={NavLink} to="/profile">
          <AccountCircleIcon />
        </IconButton>
      )} */}

      {/* Affichage conditionnel de l'icône Settings */}
      {isAssociation && (
        <IconButton title='Settings' color='secondary' component={NavLink} to="/dashboard">
          <SettingsIcon />
        </IconButton>
      )}

      {!user && (
        <IconButton title="S'inscrire" color='secondary' onClick={() => { navigate('/register'); }}>
          <AppRegistrationIcon />
        </IconButton>
      )}

      {/* Affichage conditionnel du bouton Login ou Logout */}
        {user ? (
          <IconButton
            title='Se déconnecter'
            color='secondary'
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogoutIcon />
          </IconButton>
        ) : (
          <IconButton
            title='Se connecter'
            color='secondary'
            component={NavLink}
            to="/login"
          >
            <LoginIcon />
          </IconButton>
        )}
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