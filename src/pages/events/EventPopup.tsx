import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Box, Typography, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DateTimePicker  } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { findAllEventCategories } from "../../services/EventCategoryService";
import type { EventCategory } from "../../models/EventCategory";
import type { EventAddress } from '../../models/EventAddress';
import type { City } from '../../models/City';
import { findAllCities } from '../../services/CityService';
import type { Association } from '../../models/Association';
import { findAllAssociations } from '../../services/AssociationService';
import type { School } from '../../models/School';
import { findAllSchools } from '../../services/SchoolService';
import { useEventContext } from './EventContext';

// Interface pour les props du composant
interface EventPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: number | null, formData: FormData) => Promise<void>;
  event: {
    id?: number | null;
    name?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    max_participants?: number;
    flyer_path?: string;
    address?: EventAddress;
    category_id?: number;
    category_name?: string;
    association_id?: number;
    school_id?: number;
  } | null;
}

const EventPopup: React.FC<EventPopupProps> = ({ open, onClose, onSave, event }) => {

   const { cities, associations, schools, categories } = useEventContext();

  // état local pour les champs du formulaire
  const [name, setName] = useState(event?.name || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startDate, setStartDate] = useState(event?.start_date ? new Date(event.start_date) : null);
  const [endDate, setEndDate] = useState(event?.end_date ? new Date(event.end_date) : null);
  const [maxParticipants, setMaxParticipants] = useState(event?.max_participants || 0);
  const [street, setStreet] = useState(event?.address?.street || '');
  const [zipCode, setZipCode] = useState(event?.address?.zip_code || '');
  const [cityId, setCityId] = useState<number | null>(event?.address?.city?.id || null);
  const [schoolId, setSchoolId] = useState<number | null>(event?.association?.school?.id || null);
  const [associationId, setAssociationId] = useState<number | null>(event?.association?.id || null);
  const [categoryId, setCategoryId] = useState<number | null>(event?.category?.id || null);

  // état local pour stocker le fichier du flyer
  const [flyer, setFlyer] = useState<File | null>(null);
  // référence pour le champ d'upload caché
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  if (!event) return;

  // Mise à jour des champs simples
  setName(event.name || '');
  setDescription(event.description || '');
  setStartDate(event.start_date ? new Date(event.start_date) : null);
  setEndDate(event.end_date ? new Date(event.end_date) : null);
  setMaxParticipants(event.max_participants || 0);
  setFlyer(null);
  setStreet(event.address?.street || '');
  setZipCode(event.address?.zip_code || '');
  setCityId(event.address?.city?.id || null);
  setSchoolId(event?.association?.school?.id || null);
  setAssociationId(event?.association?.id || null);
  setCategoryId(event?.category?.id || null);
}, [event]);

  // Logs de débogage
  useEffect(() => {
    console.log("Categories list:", categories);
    console.log("Event complet:", event);
  }, [event?.category?.id, categories]);


  // état pour stocker l'URL du flyer (pour l'aperçu)
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);

  // gère la sélection du fichier et génère un aperçu du flyer
  const handleFlyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFlyer(selectedFile);

      // génère un aperçu du flyer
      const reader = new FileReader();
      reader.onload = (event) => {
        setFlyerPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // déclenche le sélecteur de fichiers
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // gère la soumission du formulaire
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    if (!startDate || !endDate) {
      console.error("Les dates de début et de fin sont requises.");
      return;
    }
    formData.append('start_date', startDate.toISOString());
    formData.append('end_date', endDate.toISOString());

    formData.append('max_participants', maxParticipants.toString());

    if (flyer) {
      formData.append('flyer', flyer);
    }

    formData.append('street', street);
    formData.append('zip_code', zipCode);
    if (cityId) {
      formData.append('city_id', cityId.toString());
    }
    if (schoolId) {
      formData.append('school_id', schoolId.toString());
    }
    if (associationId) {
      formData.append('association_id', associationId.toString())
    }
    if (categoryId) {
      formData.append('category_id', categoryId.toString());
    }

    // appelle la fonction onSave avec les données du formulaire
    await onSave(event?.id || null, formData);
    onClose();
  };

  // état pour l'aperçu du flyer existant (cas du update)
  const [existingFlyerPreview, setExistingFlyerPreview] = useState<string | null>(null);
  // charge le flyer existant
  useEffect(() => {
    if (event?.flyer_path) {
      setExistingFlyerPreview(event?.flyer_path);
    } else {
      setExistingFlyerPreview(null);
    }
  }, [event]);

  // charge les catégories
  // useEffect(() => {
  //   const loadCategories = async () => {
  //     try {
  //       const data = await findAllEventCategories();
  //       setCategories(data);
  //     } catch (error) {
  //       console.error("Failed to load categories", error);
  //     }
  //   };
  //   loadCategories();
  // }, []);

  //const [cities, setCities] = useState<City[]>([]);
  // charge les villes
  // useEffect(() => {
  //   const fetchCities = async () => {
  //     try {
  //       const data = await findAllCities();
  //       setCities(data);
  //     } catch (error) {
  //       console.error("Failed to load cities :", error);
  //     }
  //   };
  //   fetchCities();
  // }, []);

  //const [associations, setAssociations] = useState<Association[]>([]);
  // charge les associations
  // useEffect(() => {
  //   const fetchAssociations = async () => {
  //     try {
  //       const data = await findAllAssociations();
  //       setAssociations(data);
  //     } catch (error) {
  //       console.error("Failed to load associations :", error);
  //     }
  //   };
  //   fetchAssociations();
  // }, []);

  //const [schools, setSchools] = useState<School[]>([]);
  // charge les écoles
  // useEffect(() => {
  //   const fetchSchools = async () => {
  //     try {
  //       const data = await findAllSchools();
  //       setSchools(data);
  //     } catch (error) {
  //       console.error("Failed to load schools :", error);
  //     }
  //   };
  //   fetchSchools();
  // }, []);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={headerStyle}>
        {event ? 'Update the event' : 'Add an event'}
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Box sx={datepickerContainer}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Date de début"
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
              slotProps={{
                textField: {
                  margin: "dense",
                  fullWidth: true,
                },
              }}
            />
            <DateTimePicker
              label="Date de fin"
              value={endDate}
              onChange={(newDate) => setEndDate(newDate)}
              slotProps={{
                textField: {
                  margin: "dense",
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </Box>
        <Box mt={2}>
          <TextField
            margin="dense"
            label="Street"
            fullWidth
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, width: '100%', mt: 2 }}>
          <TextField
            margin="dense"
            label="Zipcode"
            sx={{ flex: 1 }}
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />

          <Autocomplete
            options={cities}
            getOptionLabel={(option) => option.name}
            value={cities.find(c => c.id === cityId) || null}
            onChange={(_event, newValue) => {
              setCityId(newValue?.id || null);
            }}
            sx={{ flex: 1 }}
            renderInput={(params) => (
              <TextField {...params} label="Choose a city" margin="dense" required sx={{ width: '100%' }} />
            )}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, width: '100%', mt: 2 }}>
          <TextField
            margin="dense"
            label="Nombre maximum de participants"
            sx={{ flex: 1 }}
            type="number"
            value={maxParticipants}
            onChange={(e) => {
              const value = Number.parseInt(e.target.value, 10) || 0;
              // garantit que la valeur est >= 0
              setMaxParticipants(Math.max(0, value));
            }}
          />

          <Autocomplete
          key={`category-autocomplete-${categoryId}-${categories.length}`}
            options={categories}
            getOptionLabel={(option) => option.name}
            value={categories.find(c => c.id === categoryId) || null}
            onChange={(_, newValue) => setCategoryId(newValue?.id || null)}
            sx={{ flex: 1 }}
            renderInput={(params) => (
              <TextField {...params} label="Choose a category" margin="dense" required />
            )}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, width: '100%', mt: 2 }}>
          <Autocomplete
            options={associations}
            getOptionLabel={(option) => option.name}
            value={associations.find(a => a.id === associationId) || null}
            onChange={(_, newValue) => setAssociationId(newValue?.id || null)}
            sx={{ flex: 1 }}
            renderInput={(params) => (
              <TextField {...params} label="Choose an association" margin="dense" />
            )}
          />

          <Autocomplete
            options={schools}
            getOptionLabel={(option) => option.name}
            value={schools.find(s => s.id === schoolId) || null}
            onChange={(_, newValue) => setSchoolId(newValue?.id || null)}
            sx={{ flex: 1 }}
            renderInput={(params) => (
              <TextField {...params} label="Choose a school" margin="dense" />
            )}
          />
        </Box>
        
        <TextField sx={textfieldDescription}
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box mt={2}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFlyerChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUploadClick}
            fullWidth
          >
            {flyer ? 'Flyer sélectionné : ' + flyer.name : 'Télécharger un flyer'}
          </Button>
          {flyer && (
            <Typography variant="caption" color="textSecondary" mt={1}>
              {flyer.name} ({Math.round(flyer.size / 1024)} Ko)
            </Typography>
          )}

          {/* Aperçu dy flyer */}
          {/* {flyerPreview && flyer?.type.startsWith('image/') && (
            <Box mt={2} textAlign="center">
              <Typography variant="subtitle2" gutterBottom>
                Aperçu du flyer :
              </Typography>
              <img
                src={flyerPreview}
                alt="Aperçu du flyer"
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
              />
            </Box>
          )} */}

          {/* APERCU FLYER EXISTANT */}
          {/* {existingFlyerPreview && (
            <Box mt={2} textAlign="center">
              <img
                src={existingFlyerPreview}
                alt="Flyer actuel"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                }}
                onError={(e) => {
                  console.error("Erreur de chargement de l'image :", existingFlyerPreview);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Typography variant="subtitle2" gutterBottom>
                {event?.flyer_path}
              </Typography>
            </Box>
          )} */}

          {/* Affiche soit le nouvel aperçu, soit l'ancien, mais pas les deux */}
          {flyerPreview && flyer?.type.startsWith('image/') ? (
            <Box mt={2} textAlign="center">
              <Typography variant="subtitle2" gutterBottom>
                Aperçu du nouveau flyer :
              </Typography>
              <img src={flyerPreview} alt="Aperçu du flyer" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
            </Box>
          ) : existingFlyerPreview ? (
            <Box mt={2} textAlign="center">
              <Typography variant="subtitle2" gutterBottom>
                Flyer actuel :
              </Typography>
              <img
                src={existingFlyerPreview}
                alt="Flyer actuel"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                }}
                onError={(e) => {
                  console.error("Erreur de chargement de l'image :", existingFlyerPreview);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Typography variant="subtitle2" gutterBottom>
                {event?.flyer_path}
              </Typography>
            </Box>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventPopup;

/** @type {import("@mui/material").SxProps} */
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
  pb: 1,
  borderBottom: '1px solid',
  borderColor: 'divider',
};

const datepickerContainer = {
  marginTop: '15px',
  display: 'flex',
  gap: 2
}

const textfieldDescription = {
  marginTop: '15px',
}