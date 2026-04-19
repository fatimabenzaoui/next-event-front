import { Box, Typography, Avatar, CircularProgress } from '@mui/material';
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from 'react-pro-sidebar';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LocationSearchingOutlinedIcon from '@mui/icons-material/LocationSearchingOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { findAllEventCategories } from '../services/EventCategoryService';
import type { EventCategory } from '../models/EventCategory';
import { useEventContext } from '../pages/events/EventContext';
import type { School } from '../models/School';
import { findAllSchools } from '../services/SchoolService';
import { findAllCities } from '../services/CityService';
import { findAllAssociations } from '../services/AssociationService';
import type { City } from '../models/City';
import type { Association } from '../models/Association';
import epitechLogo from '../assets/epitech-logo.svg';


export default function SideNav() {
  const { collapsed } = useProSidebar();
  const [cities, setCities] = useState<City[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    selectedCity,
    setSelectedCity,
    selectedSchool,
    setSelectedSchool,
    selectedAssociation,
    setSelectedAssociation,
    selectedCategory,
    setSelectedCategory,
    setShowSchoolMap,

    isEpitechCampusActive, setIsEpitechCampusActive,
    isEpitechAssosActive, setIsEpitechAssosActive,
  } = useEventContext();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cityData, schoolData, associationData, categoryData] = await Promise.all([
          findAllCities(),
          findAllSchools(),
          findAllAssociations(),
          findAllEventCategories(),
        ]);
        setCities(cityData);
        setSchools(schoolData);
        setAssociations(associationData);
        setCategories(categoryData);
      } catch (e) {
        console.error("Erreur chargement SideNav", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCityClick = (cityId: number) => {
    setSelectedCity(cityId);
    setIsEpitechCampusActive(false);
    setIsEpitechAssosActive(false);
    setShowSchoolMap(false);
  };

  const handleSchoolClick = (schoolId: number) => {
    setSelectedSchool(schoolId);
    setIsEpitechCampusActive(false);
    setIsEpitechAssosActive(false);
    setShowSchoolMap(false);
  };

  const handleAssociationClick = (associationId: number) => {
    setSelectedAssociation(associationId);
    setIsEpitechCampusActive(false);
    setIsEpitechAssosActive(false);
    setShowSchoolMap(false);
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setIsEpitechCampusActive(false);
    setIsEpitechAssosActive(false);
    setShowSchoolMap(false);
  };

  const handleAllEventsClick = () => {
    setSelectedCity(null);
    setSelectedSchool(null);
    setSelectedAssociation(null);
    setSelectedCategory(null);
    setIsEpitechCampusActive(false);
    setIsEpitechAssosActive(false);
    setShowSchoolMap(false);
  };

  const handleEpitechCampusClick = () => {
    setIsEpitechCampusActive(true);
    setIsEpitechAssosActive(false);
    setSelectedCity(null);
    setSelectedSchool(null);
    setSelectedAssociation(null);
    setSelectedCategory(null);
    setShowSchoolMap(true);
  };

  const handleEpitechAssosClick = () => {
    setIsEpitechAssosActive(true);
    setIsEpitechCampusActive(false);
    setSelectedCity(null);
    setSelectedSchool(null);
    setSelectedAssociation(null);
    setSelectedCategory(null);
    setShowSchoolMap(false);
  };

  return (
    <Sidebar
      style={{
        height: '100%',
        top: 'auto',
        zIndex: 1001,
      }}
      breakPoint="md"
      backgroundColor="rgba(239, 236, 236, 1)"
    >
      <Box sx={styles.avatarContainer}>
        <Avatar sx={styles.avatar} alt="" src={epitechLogo} />
      </Box>

      <Menu
        menuItemStyles={{
          button: ({ active }) => {
            return {
              backgroundColor: active ? '#9C27B0' : 'transparent',
              color: active ? '#FFF' : '#000'
            };
          },
        }}
      >
        {/* EPITECH EVENTS */}
        <MenuItem
          active={!selectedCategory && !isEpitechCampusActive && !isEpitechAssosActive}
          component={<Link to="/" />}
          icon={<CalendarMonthOutlinedIcon />}
          onClick={handleAllEventsClick}
        >
          <Typography variant="body2">Epitech events</Typography>
        </MenuItem>

        {/* PAR VILLE */}
        <SubMenu
          icon={<LocationSearchingOutlinedIcon />}
          label={collapsed ? undefined : (
            <Typography variant="body2">Par ville</Typography>
          )}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
              <CircularProgress size={16} />
            </Box>
          ) : (
              Array.isArray(cities) && cities.map((city) => (
              <MenuItem
                key={city.id}
                onClick={() => handleCityClick(city.id)}
                active={selectedCity === city.id}
              >
                <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
                  {city.name}
                </Typography>
              </MenuItem>
            ))
          )}
        </SubMenu>

        {/* PAR ECOLE */}
        <SubMenu
          icon={<SchoolOutlinedIcon />}
          label={
            collapsed ? undefined : (
              <Typography variant="body2">Par école</Typography>
            )
          }
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
              <CircularProgress size={16} />
            </Box>
          ) : (
            Array.isArray(schools) && schools.map((school) => (
              <MenuItem
                key={school.id}
                onClick={() => handleSchoolClick(school.id)}
                active={selectedSchool === school.id}
              >
                <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
                  {school.name}
                </Typography>
              </MenuItem>
            ))
          )}
        </SubMenu>

        {/* PAR ASSOCIATION */}
        <SubMenu
          icon={<GroupOutlinedIcon />}
          label={collapsed ? undefined : (
            <Typography variant="body2">Par association</Typography>
          )}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
              <CircularProgress size={16} />
            </Box>
          ) : (
            Array.isArray(associations) && associations.map((association) => (
              <MenuItem
                key={association.id}
                onClick={() => handleAssociationClick(association.id)}
                active={selectedAssociation === association.id}
              >
                <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
                  {association.name}
                </Typography>
              </MenuItem>
            ))
          )}
        </SubMenu>

        {/* PAR CATEGORIE */}
        <SubMenu
          icon={<CategoryOutlinedIcon />}
          label={
            collapsed ? undefined : (
              <Typography variant="body2">Par catégorie</Typography>
            )
          }
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
              <CircularProgress size={16} />
            </Box>
          ) : (
            Array.isArray(categories) && categories.map((category) => (
              <MenuItem
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                active={selectedCategory === category.id}
                icon={null}
              >
                <Typography variant="body2" sx={{textTransform: 'uppercase',}}>
                  {category.name}
                </Typography>
              </MenuItem>
            ))
          )}
        </SubMenu>

        {/* EPITECH CAMPUS */}
        <MenuItem
          active={isEpitechCampusActive}
          component={<Link to="/" />}
          icon={<RoomOutlinedIcon />}
          onClick={handleEpitechCampusClick}
        >
          <Typography variant="body2">Epitech campus</Typography>
        </MenuItem>

        {/* EPITECH ASSOS */}
        <MenuItem
          active={isEpitechAssosActive}
          component={<Link to="/" />}
          icon={<GroupOutlinedIcon />}
          onClick={handleEpitechAssosClick}
        >
          <Typography variant="body2">Epitech assos</Typography>
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}


/** @type {import("@mui/material").SxProps} */
const styles = {
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    my: 5,
  },
  avatar: {
    width: '70%',
    height: 'auto',
  },
}