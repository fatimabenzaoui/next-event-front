import { Box, CircularProgress, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState, type SyntheticEvent } from "react";
import TabPanel from "../../components/TabPanel";
import type { User } from "../../models/User";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { findAllUsers } from "../../services/UserService";
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';

function Users() {

  // état pour gérer l'onglet actif
  const [value, setValue] = useState(0);
  // gère le changement d'onglet
  const handleChange = (_e: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.3 },
    { field: 'first_name', headerName: 'Prénom', flex: 1 },
    { field: 'last_name', headerName: 'Nom', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'role', headerName: 'Role', flex: 1.5 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: ( ) => (
        <Box>
          <IconButton>
            <VisibilityIcon color="primary" />
          </IconButton>
          <IconButton>
            <EditIcon color="secondary" />
          </IconButton>
          <IconButton>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // FIND ALL
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await findAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error("Failed to fetch users", { toastId: 'fetch-users-error' });
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => { loadUsers(); }, []);

  return ( 
    <Box sx={{ p: 1 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="users tabs"
        sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'rgb(156, 39, 176)',
              height: 3,
            },
            '& .Mui-selected': {
              color: 'rgb(156, 39, 176) !important',
            },
          }}
        >
          <Tab label="Users" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Roles" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Photos" id="tab-2" aria-controls="tabpanel-2" />
          <Tab label="Analytics" id="tab-3" aria-controls="tabpanel-2" />
        </Tabs>
      </Box>

      {/* USERS */}
      <TabPanel value={value} index={0}>
        <Box sx={{ p: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Users List</Typography>
            <IconButton color="primary">
              <AddIcon />
            </IconButton>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={users}
              columns={columns}
              initialState={{ pagination: { paginationModel: { pageSize: 25, page: 0 } } }}
              pageSizeOptions={[25, 50, 100]}
              getRowId={(row) => row.id}
              localeText={{ toolbarQuickFilterPlaceholder: 'Search students...' }}
              showToolbar
            />
          )}
        </Box>
      </TabPanel>

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