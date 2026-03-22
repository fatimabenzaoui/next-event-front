import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState, type SyntheticEvent } from "react";
import TabPanel from "../../components/TabPanel";
import type { School } from "../../models/School";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import AddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { createSchool, deleteSchoolById, findAllSchools, findSchoolById, updateSchoolById } from "../../services/SchoolService";
import SchoolAddresses from "./SchoolAddresses";
import Cities from "./Cities";
import SchoolPopup from "./SchoolPopup";
import SchoolMap from "../../components/SchoolMap";

function Schools() {

  // état pour gérer l'onglet actif
  const [value, setValue] = useState(0);
  // gère le changement d'onglet
  const handleChange = (_e: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // état pour stocker les écoles récupérées de l'API
  const [schools, setSchools] = useState<School[]>([]);
    
  // définition des colonnes pour le DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'street', headerName: 'Street', flex: 1, renderCell: (params) => (<div>{params.row.address?.street}</div>)},
    { field: 'zip_code', headerName: 'ZipCode', flex: 1, renderCell: (params) => (<div>{params.row.address?.zip_code}</div>)},
    { field: 'city_name', headerName: 'City', flex: 1, renderCell: (params) => (<div>{params.row.address?.city?.name}</div>)},
    { field: 'latitude', headerName: 'Latitude', flex: 1, renderCell: (params) => (<div>{params.row.address?.latitude}</div>)},
    { field: 'longitude', headerName: 'Longitude', flex: 1, renderCell: (params) => (<div>{params.row.address?.longitude}</div>)},
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton aria-label="view" onClick={() => openFindByIdPopup(params.row.id)}>
            <VisibilityIcon color="primary" />
          </IconButton>
          <IconButton aria-label="edit" onClick={() => openAddEditPopup(params.row)}>
            <EditIcon color="secondary" />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => openDeletePopup(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // FIND ALL
  const getSchools = async () => {
    try {
      const fetchedSchools = await findAllSchools();
      setSchools(fetchedSchools);
      toast.success("Schools fetched successfully", { toastId: 'fetch-schools-success' });
    } catch (error) {
      console.error("Failed to fetch schools:", error);
      toast.error("Failed to fetch schools", { toastId: 'fetch-schools-error' });
    }
  };
    
  useEffect(() => {
    getSchools();
  }, []);

  // CREATE - UPDATE
  const [open, setOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  
  const openAddEditPopup = (school: School | null = null) => {
      setCurrentSchool(school);
      setOpen(true);
  };
  
  const closeAddEditPopup = () => {
      setOpen(false);
  };
  
  const AddOrEditSchool = async (id: number | null, data: Omit<School, "id">): Promise<void> => {
    try {
      let newSchool: School;

      if (id && currentSchool) {
        newSchool = await updateSchoolById(id, data);
      } else {
        newSchool = await createSchool(data);
      }

      if (id && currentSchool) {
        setSchools(schools.map((e) => (e.id === currentSchool.id ? newSchool : e)));
      } else {
        setSchools([...schools, newSchool]);
      }
      toast.success("Record saved successfully");
    } catch (error) {
      console.error("Failed to save record:", error);
      toast.error("Failed to save record");
    }
  };


  // READ
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
          
  const openFindByIdPopup = async (id: number) => {
    try {
      const fetchedSchool = await findSchoolById(id);
      setSelectedSchool(fetchedSchool);
      setOpenModal(true); 
      toast.success("School fetched successfully", { toastId: 'fetch-school-success' });
    } catch (error) {
      console.error("Failed to fetch school:", error);
      toast.error("Failed to fetch school", { toastId: 'fetch-school-error' });
    }
  };
    
  const closeFindByIdPopup = () => {
    setOpenModal(false);
  };

  // DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [schoolIdToDelete, setSchoolIdToDelete] = useState<number | null>(null);
        
  const openDeletePopup = (id: number) => {
    setSchoolIdToDelete(id);
    setOpenDelete(true);
  };
        
  const closeDeletePopup = () => {
    setOpenDelete(false);
    setSchoolIdToDelete(null);
  };
        
  const deleteSchool = async () => {
    if (!schoolIdToDelete) return;
    try {
      await deleteSchoolById(schoolIdToDelete);
      // rafraîchit la liste
      setSchools(schools.filter((e) => e.id !== schoolIdToDelete));
      toast.success("Record deleted successfully");
      closeDeletePopup();
    } catch (error) {
      console.error("Failed to delete record :", error);
      toast.error("Failed to delete record");
    }
  };
    
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
          <Tab label="Schools" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Addresses" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Cities" id="tab-2" aria-controls="tabpanel-2" />
          <Tab label="Map" id="tab-3" aria-controls="tabpanel-3" />
        </Tabs>
      </Box>

      {/* SCHOOLS */}
      <TabPanel value={value} index={0}>
        <Box sx={{ p: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Schools List</Typography>
              <IconButton aria-label="add" onClick={() => openAddEditPopup()} color="primary">
                <AddIcon />
              </IconButton>
              <SchoolPopup
                open={open}
                onClose={closeAddEditPopup}
                onSave={AddOrEditSchool}
                school={currentSchool}
              />
            </Box>
            <DataGrid
              rows={schools}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25, page: 0 },
                },
              }}
              pageSizeOptions={[25, 50, 100]}
              getRowId={(row) => row.id}
              localeText={{
                toolbarQuickFilterPlaceholder: 'Search schools...',
              }}
              showToolbar
            />

            {/* FIND BY ID POPUP */}
            <Dialog open={openModal} onClose={closeFindByIdPopup} fullWidth maxWidth="sm">
              <DialogTitle sx={{ display: 'flex', direction: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CategoryIcon sx={{ mr: 1 }} />
                  Détails de l'école
                </Box>
                <IconButton onClick={closeFindByIdPopup}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
                  
              <DialogContent dividers>
                {selectedSchool && (
                  <Grid container spacing={2}>
                    <Grid>
                      <Typography variant="body2" color="text.secondary">
                        Identifiant : {selectedSchool.id}
                      </Typography>
                    </Grid>
                  
                    <Grid>
                      <Typography variant="body2" color="text.secondary">
                        Nom : {selectedSchool.name}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </DialogContent>
            </Dialog>

            {/* DELETE POPUP */}
            <ConfirmationDialog
              open={openDelete}
              onClose={closeDeletePopup}
              onConfirm={deleteSchool}
            />
        </Box>
      </TabPanel>
    
      {/* ADDRESSES */}
      <TabPanel value={value} index={1}><SchoolAddresses /></TabPanel>
    
      {/* CITIES */}
      <TabPanel value={value} index={2}><Cities /></TabPanel>
    
      {/* MAP */}
      <TabPanel value={value} index={3}><SchoolMap /></TabPanel>
    </Box>
  );
}

export default Schools;