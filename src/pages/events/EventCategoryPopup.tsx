import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { EventCategory } from "../../models/EventCategory";

// Interface pour les props du composant
interface EventCategoryPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: Omit<EventCategory, "id">) => Promise<void>;
  category: {
    id: number;
    name: string;
  } | null;
}

const EventCategoryPopup: React.FC<EventCategoryPopupProps> = ({ open, onClose, onSave, category }) => {

  // état local pour les champs du formulaire
  const [name, setName] = useState(category?.name || '');

  // réinitialise le formulaire quand l'événement change
  useEffect(() => {
    setName(category?.name || '');
  }, [category]);

  // gère la soumission du formulaire
  const handleSubmit = async () => {
    const data = {
      name: name,
    };
    const id = category?.id || 0;
    await onSave(id, data);
      onClose();
    };

  return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={headerStyle}>
          {category ? 'Update the category' : 'Add a category'}
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

export default EventCategoryPopup;

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
