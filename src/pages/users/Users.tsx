import { Box, Tab, Tabs } from "@mui/material";
import { useState, type SyntheticEvent } from "react";
import TabPanel from "../../components/TabPanel";

function Users() {

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
          <Tab label="Users" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Roles" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Photos" id="tab-2" aria-controls="tabpanel-2" />
          <Tab label="Analytics" id="tab-3" aria-controls="tabpanel-2" />
        </Tabs>
      </Box>

      {/* USERS */}
      <TabPanel value={value} index={0}>Users</TabPanel>

      {/* ROLES */}
      <TabPanel value={value} index={1}>Roles</TabPanel>

      {/* PHOTOS */}
      <TabPanel value={value} index={2}>Photos</TabPanel>

      {/* ANALYTICS */}
      <TabPanel value={value} index={3}>Analytics</TabPanel>
    </Box>
   );
}

export default Users;