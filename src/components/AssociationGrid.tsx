import React from 'react';
import { Grid, Container } from '@mui/material';
import AssociationCard from './AssociationCard';
import { useEventContext } from '../pages/events/EventContext';

const AssociationGrid = () => {
  // Récupère les associations depuis le contexte
  const { associations } = useEventContext();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {associations.map((association) => (
          <Grid item key={association.id} xs={12} sm={6} md={4} lg={3}>
            <AssociationCard association={association} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AssociationGrid;
