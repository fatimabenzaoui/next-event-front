import { Box, Typography } from '@mui/material';
import TabPanel from '../../components/TabPanel';
import { useState } from 'react';
import OverviewChart from './OverviewChart';

function Analytics() {
  // état pour gérer l'onglet actif
  const [value] = useState(0);

  return ( 
    <Box>
      <TabPanel value={value} index={0}>
        <Box>
          <Box>
            <OverviewChart />
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>  
        <Typography>Traffic content goes here</Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography>User Behavior content goes here</Typography>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography>Revenue content goes here</Typography>
      </TabPanel>
    </Box>
  );
}

export default Analytics;