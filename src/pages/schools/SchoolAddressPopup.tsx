import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { SchoolAddress } from "../../models/SchoolAddress";
import type { City } from '../../models/City';

// Interface pour les props du composant
interface SchoolAddressPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: Omit<SchoolAddress, "id">) => Promise<void>;
  address: SchoolAddress | null;
}

const SchoolAddressPopup: React.FC<SchoolAddressPopupProps> = ({ open, onClose, onSave, address }) => {

  // état local pour les champs du formulaire
  const [street, setStreet] = useState<string>(address?.street || '');
  const [zipCode, setZipCode] = useState<string>(address?.zip_code || '');
  const [cityId, setCityId] = useState<number | null>(address?.city?.id || null);
  const [cityName, setCityName] = useState<string>(address?.city?.name || '');
  const [cities, setCities] = useState<City[]>([]);

  // réinitialise le formulaire quand l'événement change
  useEffect(() => {
    setStreet(address?.street || '');
    setZipCode(address?.zip_code || '');
    setCityId(address?.city?.id || null);
    setCityName(address?.city?.name || '');
  }, [address]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/cities/');
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des villes :", error);
      }
    };
    fetchCities();
  }, []);

  // gère la soumission du formulaire
  const handleSubmit = async () => {
    if (!cityId) {
      console.error("Veuillez sélectionner une ville.");
      return;
    }

    const data: Omit<SchoolAddress, "id"> = {
      street: street,
      zip_code: zipCode,
      city_id: cityId || 0,
      latitude: address?.latitude || 0,
      longitude: address?.longitude || 0,
    };

    const id = address?.id || null;
    await onSave(id, data);
    onClose();
  };

  return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={headerStyle}>
          {address ? 'Update the address' : 'Add an address'}
          <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          
          <TextField
            autoFocus
            margin="dense"
            label="Street"
            fullWidth
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />

          <TextField
            autoFocus
            margin="dense"
            label="Zipcode"
            fullWidth
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />

          <Autocomplete
            options={cities}
            getOptionLabel={(option) => option.name}
            value={cities.find(c => c.id === cityId) || null}
            onChange={(_event, newValue) => {
              setCityId(newValue?.id || null);
              setCityName(newValue?.name || '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                margin="dense"
                label="City"
                fullWidth
                required
              />
            )}
          />
  
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

export default SchoolAddressPopup;

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
