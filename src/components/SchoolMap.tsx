import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import ZoomToEvent from './ZoomToEvent';
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Autocomplete, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { geocodeAddress } from '../services/EventAddressService';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import type { School } from '../models/School';
import { findAllSchools } from '../services/SchoolService';

const SchoolMap = () => {

  // état pour stocker les écoles récupérées de l'API
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  // FIND ALL SCHOOLS
  const getSchools = async () => {
    try {
      const fetchedSchools = await findAllSchools();
      setSchools(fetchedSchools);
      toast.success("Schools fetched successfully", {toastId: 'fetch-schools-success'});
    } catch (error) {
      console.error("Failed to fetch schools:", error);
      toast.error("Failed to fetch schools", {toastId: 'fetch-schools-error'});
    }
  };
  
  useEffect(() => {
    getSchools();
  }, []);

  // Carte des écoles
  // état pour les écoles géocodées
  const [geocodedSchools, setGeocodedSchools] = useState<School[]>([]);
  // état de chargement
  const [isGeocoding, setIsGeocoding] = useState(false);
    
  // Géocode une adresse
  const geocodeSchools = async () => {
    if (schools.length > 0 && geocodedSchools.length === 0 && !isGeocoding) {
      setIsGeocoding(true);
      try {
        const updatedSchools = await Promise.all(
          schools.map(async (school) => {
            if (!school.address?.latitude || !school.address?.longitude) {
              try {
                const address = `${school.address?.street}, ${school.address?.zip_code} ${school.address?.city?.name}`;
                const coords = await geocodeAddress(address);
                return { ...school, address: { ...school.address, latitude: coords.latitude, longitude: coords.longitude } as typeof school.address };
              } catch (error) {
                console.error("Erreur de géocodage pour l'école :", school.name, error);
                toast.warning(`Impossible de géocoder l'adresse de l'école : ${school.name}`);
                return school;
              }
            }
            return school;
          })
        );
        setGeocodedSchools(updatedSchools);
      } finally {
        setIsGeocoding(false);
      }
    }
  };

  useEffect(() => {
    geocodeSchools();
  }, [schools]);

  return (
    <Box sx={{ mt: 2, p: 4, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 2, width:'100%' }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{display:'flex', gap:2, width: '100%'}}>
          <Autocomplete
            sx={{ width: '100%', flexGrow: 1 }}
            options={geocodedSchools}
            getOptionLabel={(option) => option?.name || ''}
            onChange={(_event, value) => setSelectedSchool(value)}
            renderInput={(params) => (
              <TextField {...params} label="Rechercher une école" />
            )}
          />
        </Box>
      </Typography>

      <Box sx={{height:850, backgroundColor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary'}}>
        {isGeocoding && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1000 }}>
          <CircularProgress />
        </Box>
      )}
      
        <MapContainer
          // centre de la France
          center={[46.603354, 1.888334]}
          zoom={3}
          style={{ height: '850px', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {geocodedSchools.map((school) => (
            <Marker
              key={school.id}
              position={[school.address?.latitude ?? 0, school.address?.longitude ?? 0]}
            >
              <Tooltip>{school.name}</Tooltip>
            </Marker>
          ))}
                
          {selectedSchool && (
            <ZoomToEvent event={selectedSchool} />
          )}
        </MapContainer>
      </Box>
    </Box>
  );
}

export default SchoolMap;

/** @type {import("@mui/material").SxProps} */