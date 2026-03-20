import { Box, Tab, Tabs } from "@mui/material";
import { useState, type SyntheticEvent } from "react";
import TabPanel from "../../components/TabPanel";

function Students() {
    
  // état pour gérer l'onglet actif
  const [value, setValue] = useState(0);
  // gère le changement d'onglet
  const handleChange = (_e: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  
  return ( 
    <Box sx={{ p: 1 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="users tabs">
          <Tab label="Students" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Comments" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Analytics" id="tab-2" aria-controls="tabpanel-2" />
        </Tabs>
      </Box>
  
        {/* STUDENTS */}
        <TabPanel value={value} index={0}>Students</TabPanel>
  
        {/* ROLES */}
        <TabPanel value={value} index={1}>Comments</TabPanel>
  
        {/* ANALYTICS */}
        <TabPanel value={value} index={2}>Analytics</TabPanel>
      </Box>
    );
  }

export default Students;