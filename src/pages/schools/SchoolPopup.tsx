import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Box, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { School } from '../../models/School';
import type { City } from '../../models/City';
import { findAllCities } from '../../services/CityService';

// Interface pour les props du composant
interface SchoolPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: Omit<School, "id">) => Promise<void>;
  school: {
    id: number;
    name: string;
    email: string;
    phone: string;
    street?: string;
    zip_code?: string;
    city_id?: number;
  } | null;
}

const SchoolPopup: React.FC<SchoolPopupProps> = ({ open, onClose, onSave, school }) => {

  // état local pour les champs du formulaire
  const [name, setName] = useState(school?.name || '');
  const [email, setEmail] = useState(school?.email || '');
  const [phone, setPhone] = useState(school?.phone || '');
  const [street, setStreet] = useState(school?.street || '');
  const [zipCode, setZipCode] = useState(school?.zip_code || '');
  const [cityId, setCityId] = useState<number | null>(school?.city_id || null);

  // réinitialise le formulaire quand la ville change
  useEffect(() => {
    setName(school?.name || '');
    setEmail(school?.email || '');
    setPhone(school?.phone || '');
    setStreet(school?.street || '');
    setZipCode(school?.zip_code || '');
    setCityId(school?.city_id || null);
  }, [school]);

  // gère la soumission du formulaire
  const handleSubmit = async () => {
    const data = {
      name: name,
      email: email,
      phone: phone,
      street: street,
      zip_code: zipCode,
      city_id: cityId || 0,
    };
    const id = school?.id || 0;
    await onSave(id, data);
    onClose();
  };

  const [cities, setCities] = useState<City[]>([]);
  // charge les villes
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await findAllCities();
        setCities(data);
        setCities(data);
      } catch (error) {
        console.error("Failed to load cities :", error);
      }
    };
    fetchCities();
  }, []);

  return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={headerStyle}>
          {school ? 'Update the school' : 'Add a school'}
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

          <TextField
            autoFocus
            margin="dense"
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            autoFocus
            margin="dense"
            label="Phone"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Box mt={2}>
          <TextField
            margin="dense"
            label="Street"
            fullWidth
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />

          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
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

export default SchoolPopup;

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