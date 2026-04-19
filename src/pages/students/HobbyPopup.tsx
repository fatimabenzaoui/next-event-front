import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Hobby } from '../../models/Hobby';

interface HobbyPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: Omit<Hobby, 'id'>) => Promise<void>;
  hobby: Hobby | null;
}

const HobbyPopup: React.FC<HobbyPopupProps> = ({ open, onClose, onSave, hobby }) => {
  const [name, setName] = useState(hobby?.name || '');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    setName(hobby?.name || '');
    setNameError('');
  }, [hobby]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError('Le nom est requis');
      return;
    }
    await onSave(hobby?.id || null, { name: name.trim() });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={headerStyle}>
        {hobby ? 'Modifier le hobby' : 'Ajouter un hobby'}
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nom"
          fullWidth
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError(''); }}
          error={!!nameError}
          helperText={nameError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary">Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HobbyPopup;

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
  pb: 1,
  borderBottom: '1px solid',
  borderColor: 'divider',
};
