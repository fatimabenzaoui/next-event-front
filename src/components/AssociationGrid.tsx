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
            <AssociationCard key={association.id} association={association} />
        ))}
      </Grid>
    </Container>
  );
};

export default AssociationGrid;
