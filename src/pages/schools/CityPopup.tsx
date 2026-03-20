import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { City } from '../../models/City';

// Interface pour les props du composant
interface CityPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: Omit<City, "id">) => Promise<void>;
  city: {
    id: number;
    name: string;
    zip_code: string;
  } | null;
}

const CityPopup: React.FC<CityPopupProps> = ({ open, onClose, onSave, city }) => {

  // état local pour les champs du formulaire
  const [name, setName] = useState(city?.name || '');
  const [zipCode, setZipCode] = useState(city?.zip_code || '');


  // réinitialise le formulaire quand la ville change
  useEffect(() => {
    setName(city?.name || '');
    setZipCode(city?.zip_code || '');
  }, [city]);

  // gère la soumission du formulaire
  const handleSubmit = async () => {
    const data = {
      name: name,
      zip_code: zipCode,
    };
    const id = city?.id || 0;
    await onSave(id, data);
      onClose();
    };

  return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={headerStyle}>
          {city ? 'Update the city' : 'Add a city'}
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
            label="Zipcode"
            fullWidth
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
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

export default CityPopup;

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