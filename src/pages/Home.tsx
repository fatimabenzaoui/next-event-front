import React, { useState, useEffect } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Chip, IconButton, Modal, Fade, useTheme, useMediaQuery, CardActions, Button } from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// @ts-ignore
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from 'framer-motion';
import type { Event } from '../models/Event';
import { formatEventDateRange } from '../utils/dateFormat';
import { findAllHomeEvents, findEventsByCity, findEventsBySchool, findEventsByAssociation, findEventsByCategory } from '../services/EventService';
import { useEventContext } from './events/EventContext';
import EventMapHome from '../components/EventMapHome';
import SchoolMap from '../components/SchoolMap';
import AssociationGrid from '../components/AssociationGrid';

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [events, setEvents] = useState<Event[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { cities, schools, associations, categories, selectedCity, selectedSchool, selectedAssociation, selectedCategory, showSchoolMap, isEpitechCampusActive, isEpitechAssosActive } = useEventContext();


const getTitle = () => {
  if (isEpitechCampusActive) return 'Epitech Campus';
  if (isEpitechAssosActive) return 'Epitech Assos';
  if (selectedCity) return `Epitech Events - ${cities.find(c => c.id === selectedCity)?.name || 'Ville inconnue'}`;
  if (selectedSchool) return `Events - ${schools.find(s => s.id === selectedSchool)?.name || 'École inconnue'}`;
  if (selectedAssociation) return `Epitech Events - ${associations.find(a => a.id === selectedAssociation)?.name || 'Association inconnue'}`;
  if (selectedCategory) return `Epitech Events - ${categories.find(c => c.id === selectedCategory)?.name || 'Catégorie inconnue'}`;
  return 'Epitech Events';
};

  // Charge les événements en fonction de la ville, de l'école, de l'association, de la catégorie
  useEffect(() => {
    const loadEvents = async () => {
      try {
        let data: any;

        if (selectedCity) {
          data = await findEventsByCity(selectedCity);
        } else if (selectedSchool) {
          data = await findEventsBySchool(selectedSchool);
        } else if (selectedAssociation) {
          data = await findEventsByAssociation(selectedAssociation);
        } else if (selectedCategory) {
          data = await findEventsByCategory(selectedCategory);
        } else {
          data = await findAllHomeEvents();
        }

        const mappedData = data.map((event: any) => ({
          ...event,
          address: event.address
            ? {
                id: event.address.id,
                street: event.address.street,
                zip_code: event.address.zip_code,
                // city: event.address.city?.name || "",
                city: event.address.city,
                latitude: event.address.latitude,
                longitude: event.address.longitude,
              }
            : undefined,
        }));

        setEvents(mappedData);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    loadEvents();
  }, [selectedCity, selectedSchool, selectedAssociation, selectedCategory]);


  // Gestion des favoris
  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
      } else {
        newFavorites.add(eventId);
      }
      return newFavorites;
    });
  };

  // Ouverture de la modale pour plus d'infos
  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  // Fermeture de la modale
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Configuration du carrousel
  const sliderSettings = {
    lazyLoad: 'ondemand',
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: isMobile ? 1 : 2,
    arrows: true,
    prevArrow: <ArrowBackIosIcon sx={{ color: 'primary.main', left: '-25px' }} />,
    nextArrow: <ArrowForwardIosIcon sx={{ color: 'primary.main', right: '-25px' }} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      
      {/* Titre : Epitech events par défaut */}
      <Typography variant="h4" sx={carrouselTitle}>
        {getTitle()}
      </Typography>


      {/* Affiche SchoolMap si showSchoolMap est vrai */}
      {showSchoolMap && <SchoolMap />}

      {/* Carrousel des événements */}
      {!(isEpitechCampusActive || isEpitechAssosActive) && (
      <Box sx={{ mb: 6 }}>
        <Slider {...sliderSettings}>
          {events.map((event) => (
            <Box key={event.id} sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenModal(event)}
                style={{ cursor: 'pointer' }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 3,
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                >
                  {/* Image du flyer */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={event.flyer_path || '../src/assets/default-flyer.png'}
                    alt={event.name}
                    sx={{
                      objectFit: 'cover',
                      backgroundColor: 'grey.200',
                    }}
                  />

                  {/* Contenu de la carte */}
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      {/* Catégorie */}
                      <Chip
                        label={event.category_name}
                        size="small"
                        sx={{
                          backgroundColor: '#42A5F5',
                          color: '#FFF',
                        }}
                      />
                      {/* Bouton Favoris */}
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(event?.id?.toString() || '');
                        }}
                        sx={{ p: 0.5 }}
                      >
                        {favorites.has(event.id?.toString() || '') ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon color="action" />
                        )}
                      </IconButton>
                    </Box>

                    <Box>
                      {/* Titre de l'événement */}
                      <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                        {event.name} 
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <EventIcon sx={{ mr: 0.5, verticalAlign: 'middle' }} /><strong>Date :</strong> {formatEventDateRange(String(event.start_date ?? ''), String(event.end_date ?? '')).date}<br/>
                        <AccessTimeIcon sx={{ mr: 0.5, verticalAlign: 'middle' }} /><strong>Heure :</strong> {formatEventDateRange(String(event.start_date ?? ''), String(event.end_date ?? '')).time}<br/>
                        <LocationOnIcon sx={{ mr: 0.5, verticalAlign: 'middle' }} /><strong>Lieu :</strong> {String(event?.address?.street ?? '')} {" "} {String(event?.address?.zip_code ?? '')} {" "} {String(event?.address?.city?.name ?? '')}
                      </Typography>
                    </Box>                    
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>

                    {/* Badge "Nbre de participants" */}
                    <Chip
                      label={`15 participants`}
                      variant="outlined"
                      color="primary"
                    />

                    {/* Bouton "Je m'inscris" */}
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Inscription à l'évènement : ${event.name}`);
                      }}
                    >
                      Je m'inscris
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Slider>
      </Box>
      )}

      {/* Popup pour les détails de l'événement */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              maxWidth: 600,
              width: '90%',
              outline: 'none',
            }}
          >
            {selectedEvent && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                  <IconButton onClick={handleCloseModal}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {selectedEvent.name}
                </Typography>
                <CardMedia
                  component="img"
                  height="200"
                  image={selectedEvent.flyer_path || '../src/assets/default-flyer.png'}
                  alt={selectedEvent.name}
                  sx={{ objectFit: 'cover', mb: 2, borderRadius: 1 }}
                />
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedEvent.description || 'Aucune description disponible.'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Chip
                    label={selectedEvent.category_name}
                    sx={{ backgroundColor: 'primary.light', color: 'primary.contrastText' }}
                  />
                  <Chip
                    label={`${selectedEvent.max_participants} participants`}
                    variant="outlined"
                    color="primary"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Date :</strong> {formatEventDateRange(String(selectedEvent.start_date ?? ''), String(selectedEvent.end_date ?? '')).date} ({formatEventDateRange(String(selectedEvent.start_date ?? ''), String(selectedEvent.end_date ?? '')).time})                  
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Lieu :</strong> {selectedEvent.address?.street} {" "} {selectedEvent.address?.zip_code} {" "} {String(selectedEvent.address?.city?.name ?? '')}                 
                </Typography>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
      
      {/* Map */}
      {!(isEpitechCampusActive || isEpitechAssosActive) && <EventMapHome />}

      {/* Assos */}
      {isEpitechAssosActive && associations && associations.length > 0 && <AssociationGrid />}
    </Box>
  );
};

export default Home;

/** @type {import("@mui/material").SxProps} */
const carrouselTitle = {
  fontFamily: 'Holtwood One SC',
  color: '#9C27B0',
  textShadow: '2px 2px #000',
  fontSize: '30px',
  textAlign: 'center',
}