import { Box, Tab, Tabs, Typography } from '@mui/material';
import TabPanel from '../../components/TabPanel';
import { useState, type SyntheticEvent } from 'react';
import OverviewChart from './OverviewChart';


function Analytics() {
  // état pour gérer l'onglet actif
  const [value, setValue] = useState(0);
  // gère le changement d'onglet
  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  
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

/** @type {import("@mui/material").SxProps} */
const styles = {
  pageTitle: {

  },
}