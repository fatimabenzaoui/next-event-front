import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { EventFlyer } from '../../models/EventFlyer';

// Interface pour les props du composant
interface EventFlyerPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: string | null, formData: FormData) => Promise<void>;
  flyer: EventFlyer | null;
}

const EventCategoryPopup: React.FC<EventFlyerPopupProps> = ({ open, onClose, onSave, flyer }) => {
  // État pour stocker le fichier du flyer
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Référence pour le champ d'upload caché
  const fileInputRef = useRef<HTMLInputElement>(null);

  // état local pour les champs du formulaire
  const [file_name, setFileName] = useState(flyer?.file_name || '');
  const [file_path, setFilePath] = useState(flyer?.file_path || '');

  // réinitialise le formulaire quand l'événement change
  useEffect(() => {
    setFileName(flyer?.file_name || '');
    setFilePath(flyer?.file_path || '');
  }, [flyer]);

  // état pour stocker l'URL du flyer (pour l'aperçu)
    const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  
    // gère la sélection du fichier et génère un aperçu du flyer
    const handleFlyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
  
        // génère un aperçu du flyer
        const reader = new FileReader();
        reader.onload = (flyer) => {
          setFlyerPreview(flyer.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
  
    // déclenche le sélecteur de fichiers
    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };

  // état pour l'aperçu du flyer existant (cas du update)
    const [existingFlyerPreview, setExistingFlyerPreview] = useState<string | null>(null);
  
    // charge le flyer existant
    useEffect(() => {
      if (flyer?.file_path) {
        setExistingFlyerPreview(flyer?.file_path);
      } else {
        setExistingFlyerPreview(null);
      }
    }, [flyer]);

  // gère la soumission du formulaire
  const handleSubmit = async () => {
    const formData = new FormData();
    
    if (selectedFile) {
      formData.append('file_path', selectedFile);
      formData.append('file_name', selectedFile.name);
    } 
    await onSave(flyer?.id.toString() || null , formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={headerStyle}>
        {flyer ? 'Update the flyer' : 'Add a flyer'}
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>   
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
            {flyer ? 'Flyer sélectionné : ' + flyer.file_name : 'Télécharger un flyer'}
          </Button>
          {flyer && (
            <Typography variant="caption" color="textSecondary" mt={1}>
              {flyer.file_name}
            </Typography>
          )}
          
          {/* APERCU DU FLYER CHARGE */}
          {flyerPreview && selectedFile?.type.startsWith('image/') && (
            <Box mt={2} textAlign="center">
              <Typography variant="subtitle2" gutterBottom>
                Aperçu du flyer :
              </Typography>
              <img src={flyerPreview} alt="Aperçu du flyer" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
            </Box>
          )}
          
          {/* APERCU FLYER EXISTANT */}
          {existingFlyerPreview && (
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
                {flyer?.file_path}
              </Typography>
            </Box>
          )}
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