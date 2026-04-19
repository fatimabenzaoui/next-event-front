import { useState, useEffect, type SyntheticEvent } from 'react';
import { Box, Tab, Tabs, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import type { Association } from '../../models/Association';
import { deleteAssociationById, findAllAssociations, findAssociationById } from '../../services/AssociationService';
import TabPanel from "../../components/TabPanel";
import ConfirmationDialog from '../../components/ConfirmationDialog';

function Associations() {

  // état pour gérer l'onglet actif
  const [value, setValue] = useState(0);
  // gère le changement d'onglet
  const handleChange = (_e: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // état pour stocker les associations récupérées de l'API
  const [associations, setAssociations] = useState<Association[]>([]);
  
  // définition des colonnes pour le DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.1 },
    { field: 'name', headerName: 'Name', flex: 1 },
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
          <IconButton aria-label="edit" onClick={() => updateAssociationById(params.row.id)}>
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
  const getAssociations = async () => {
    try {
      const fetchedAssociations = await findAllAssociations();
      setAssociations(fetchedAssociations);
    } catch (error) {
      console.error("Failed to fetch associations:", error);
      toast.error("Failed to fetch associations", { toastId: 'fetch-associations-error' });
    }
  };
  
  useEffect(() => {
    getAssociations();
  }, []);
  
  // CREATE
  const addNewAssociation = () => {
    console.log('Add new association');
  };
  
  // UPDATE
  const updateAssociationById = (id: number) => {
    console.log(`Edit association with id: ${id}`);
  };
  
  // READ
  const [selectedAssociation, setSelectedAssociation] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
        
  const openFindByIdPopup = async (id: number) => {
    try {
      const fetchedAssociation = await findAssociationById(id);
      setSelectedAssociation(fetchedAssociation);
      setOpenModal(true); 
      toast.success("Association fetched successfully", { toastId: 'fetch-association-success' });
    } catch (error) {
      console.error("Failed to fetch association:", error);
      toast.error("Failed to fetch association", { toastId: 'fetch-association-error' });
    }
  };
  
  const closeFindByIdPopup = () => {
    setOpenModal(false);
  };
  
  // DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [associationIdToDelete, setAssociationIdToDelete] = useState<number | null>(null);
      
  const openDeletePopup = (id: number) => {
    setAssociationIdToDelete(id);
    setOpenDelete(true);
  };
      
  const closeDeletePopup = () => {
    setOpenDelete(false);
    setAssociationIdToDelete(null);
  };
      
  const deleteAssociation = async () => {
    if (!associationIdToDelete) return;
    try {
      await deleteAssociationById(associationIdToDelete);
      // rafraîchit la liste
      setAssociations(associations.filter((e) => e.id !== associationIdToDelete));
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
          <Tab label="Associations" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Analytics" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </Box>
    
      {/* ASSOCIATIONS */}
      <TabPanel value={value} index={0}>
        <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Associations List</Typography>
        <IconButton aria-label="add" onClick={() => addNewAssociation()} color="primary">
          <AddIcon />
        </IconButton>
      </Box>
      <DataGrid
        rows={associations}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        getRowId={(row) => row.id}
        localeText={{
          toolbarQuickFilterPlaceholder: 'Search associations...',
        }}
        showToolbar
      />

      {/* FIND BY ID POPUP */}
      <Dialog open={openModal} onClose={closeFindByIdPopup} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', direction: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CategoryIcon sx={{ mr: 1 }} />
            Détails de l'association
          </Box>
          <IconButton onClick={closeFindByIdPopup}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      
        <DialogContent dividers>
          {selectedAssociation && (
            <Grid container spacing={2}>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Identifiant : {selectedAssociation.id}
                </Typography>
              </Grid>
      
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Nom : {selectedAssociation.name}
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
        onConfirm={deleteAssociation}
      />
    </Box>
      </TabPanel>
  
    
      {/* ANALYTICS */}
      <TabPanel value={value} index={1}>Analytics</TabPanel>
    </Box>
   );
}

export default Associations;