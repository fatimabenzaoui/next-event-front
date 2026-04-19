import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet';
import ZoomToEvent from './ZoomToEvent';
import { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress, Autocomplete, TextField } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { formatEventDateRange } from "../utils/dateFormat";
import { toast } from "react-toastify";
import { findAllHomeEvents } from "../services/EventService";
import { geocodeAddress } from '../services/EventAddressService';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import type { Event } from '../models/Event';
import L from 'leaflet';

// corrige le chemin des icônes
const defaultIcon = L.icon({
  iconRetinaUrl: '/next-event-front/img/marker-icon-2x.png',
  iconUrl: '/next-event-front/img/marker-icon.png',
  shadowUrl: '/next-event-front/img/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// définit l'icône par défaut
L.Marker.prototype.options.icon = defaultIcon;

const EventMap = () => {

  // état pour stocker les événements récupérés de l'API
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // FIND ALL EVENTS
  const getEvents = async () => {
    try {
      const fetchedEvents = await findAllHomeEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Failed to fetch event:", error);
      toast.error("Failed to fetch event", {toastId: 'fetch-events-error'});
    }
  };
  
  useEffect(() => {
    getEvents();
  }, []);

  // Carte des évènements
  // état pour les événements géocodés
  const [geocodedEvents, setGeocodedEvents] = useState<Event[]>([]);
  // état de chargement
  const [isGeocoding, setIsGeocoding] = useState(false);
    
  // Géocode une adresse
  const geocodeEvents = async () => {
    if (events.length > 0 && geocodedEvents.length === 0 && !isGeocoding) {
      setIsGeocoding(true);
      try {
        const updatedEvents = await Promise.all(
          events.map(async (event) => {
            if (!event.address?.latitude || !event.address?.longitude) {
              try {
                const address = `${event.address?.street}, ${event.address?.zip_code} ${event.address?.city?.name}`;
                const coords = await geocodeAddress(address);
                return { ...event, address: { ...event.address, latitude: coords.latitude, longitude: coords.longitude } };
              } catch (error) {
                console.error("Erreur de géocodage pour l'évènement :", event.name, error);
                toast.warning(`Impossible de géocoder l'adresse de l'évènement : ${event.name}`);
                return event;
              }
            }
            return event;
          })
        );
        setGeocodedEvents(updatedEvents);
      } finally {
        setIsGeocoding(false);
      }
    }
  };

  useEffect(() => {
    geocodeEvents();
  }, [events]);

  return (
    <Box sx={{ mt: 2, p: 4, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 2, width:'100%' }}>
      
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', width: '100%' }}>
        {/* <Box sx={{width:'33%', display: 'flex', alignItems: 'center'}}><MapIcon color="primary" sx={{ mr: 1 }} />
        Carte des évènements</Box> */}
        <Box sx={{display:'flex', gap:2, width: '100%'}}>
          <Autocomplete
            sx={{ width: '100%', flexGrow: 1 }}
            options={geocodedEvents}
            getOptionLabel={(option) => option?.name || ''}
            onChange={(_event, value) => setSelectedEvent(value)}
            renderInput={(params) => (
              <TextField {...params} label="Rechercher un évènement" />
            )}
          />
        </Box>
      </Typography>

      <Box sx={{height:500, backgroundColor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary'}}>
        {isGeocoding && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1000 }}>
          <CircularProgress />
        </Box>
      )}
      
        <MapContainer
          // centre de la France
          center={[46.603354, 1.888334]}
          zoom={6}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {geocodedEvents.map((event) => (
            <Marker
              key={event.id}
              position={[event.address?.latitude ?? 0, event.address?.longitude ?? 0]}
            >
              <Tooltip>{event.name}</Tooltip>
              <Popup>
                <Typography sx={{p:2}}>
                  <Typography sx={{textAlign: 'center',}}><strong>{event.name}</strong></Typography>
                  <EventIcon sx={{ mr: 0.5, verticalAlign: 'middle' }} /><strong>Date :</strong> {formatEventDateRange(event.start_date ?? '', event.end_date ?? '').date}<br/>
                  <AccessTimeIcon sx={{ mr: 0.5, verticalAlign: 'middle' }} /><strong>Heure :</strong> {formatEventDateRange(event.start_date ?? '', event.end_date ?? '').time}<br/>
                  <LocationOnIcon sx={{ mr: 0.5, verticalAlign: 'middle' }} /><strong>Lieu :</strong> {event?.address?.street}, {event?.address?.zip_code} {event?.address?.city?.name}<br />
                  <Box sx={{textAlign: 'center', mt:2}}>{/* Bouton "Je m'inscris" */}
                    <Button
                     sx={{textAlign: 'center', mt:2}}
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => {
                        console.log(`Inscription à l'évènement : ${event.name}`);
                      }}
                    >
                      Je m'inscris
                    </Button>
                  </Box>
                </Typography>
              </Popup>
            </Marker>
          ))}
                
          {selectedEvent && (
            <ZoomToEvent event={selectedEvent} />
          )}
        </MapContainer>
      </Box>
    </Box>
  );
}

export default EventMap;

/** @type {import("@mui/material").SxProps} */