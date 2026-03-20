import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  content?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmer la suppression",
  content = "Êtes-vous sûr de vouloir supprimer cet enregistrement ? Cette action est irréversible.",
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={headerStyle}>
        <DialogTitle>{title}</DialogTitle>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <DialogContentText>
          <IconButton>
            <WarningAmberIcon />
          </IconButton>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

/** @type {import("@mui/material").SxProps} */
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mr: 1,
  mb: 2,
  pb: 1,
  borderBottom: '1px solid',
  borderColor: 'divider',
};
