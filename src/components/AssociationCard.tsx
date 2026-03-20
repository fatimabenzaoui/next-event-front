import React from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { Association } from '../models/Association';

// Conteneur principal (remplace Card)
const FlipCardContainer = styled('div')({
  perspective: '1000px',
  // width: '100%',
  minWidth: '325px',
  height: '250px',
  margin: '16px',
});

// Carte avec effet 3D
const FlipCard = styled('div')({
  width: '100%',
  height: '100%',
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  '&:hover': {
    transform: 'rotateY(180deg)',
  },
});

// Style commun aux deux faces
const CardFace = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '20px',
  boxSizing: 'border-box',
  borderRadius: '8px',
});

// Face avant
const FrontFace = styled(CardFace)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  color: theme.palette.text.primary,
}));

// Face arrière (tournée par défaut)
const BackFace = styled(CardFace)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  transform: 'rotateY(180deg)',
}));

const AssociationCard = ({ association }: { association: Association }) => {
  return (
    <FlipCardContainer>
      <FlipCard>
        <FrontFace>
          <Typography variant="h5" gutterBottom>
            {association.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Email: {association.school?.email || "Non renseigné"}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Téléphone: {association.school?.phone || "Non renseigné"}
          </Typography>
          <Box mt={2}>
            <Chip label={association.school?.name || "Inconnu"} color="primary" size="small" />
          </Box>
        </FrontFace>
        <BackFace>
          <Typography variant="h6" gutterBottom>
            À propos
          </Typography>
          <Typography variant="body2">
            {association.description || "Aucune description disponible."}
          </Typography>
        </BackFace>
      </FlipCard>
    </FlipCardContainer>
  );
};

export default AssociationCard;




