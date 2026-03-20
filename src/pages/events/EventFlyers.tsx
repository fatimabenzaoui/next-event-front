import { useState, useEffect } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import type { EventFlyer } from '../../models/EventFlyer';
import { createEventFlyer, deleteEventFlyerById, findAllEventFlyers, findEventFlyerById, updateEventFlyerById } from '../../services/EventFlyerService';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import EventFlyerPopup from './EventFlyerPopup';

const EventFlyers = () => {

  // état pour stocker les flyers récupérés de l'API
  const [eventFlyers, setEventFlyers] = useState<EventFlyer[]>([]);

  // définition des colonnes pour le DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.1 },
    {
      field: 'defaultFlyer',
      headerName: 'Flyer',
      flex: 0.4,
      renderCell: (params) => (
        <img
          src={params.row.file_path || '/src/assets/default-flyer.png'}
          alt="Flyer"
          style={{ width: '40%', height: 'auto', maxHeight: 100 }}
        />
      ),
    },
    { field: 'file_path', headerName: 'Path', flex: 1 },
    { field: 'file_name', headerName: 'Name', flex: 1.5 },
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
  const getEventFlyers = async () => {
    try {
      const fetchedEventFlyers = await findAllEventFlyers();
      setEventFlyers(fetchedEventFlyers);
      toast.success("Flyers fetched successfully", { toastId: 'fetch-flyers-success' });
    } catch (error) {
      console.error("Failed to fetch flyers:", error);
      toast.error("Failed to fetch flyers", { toastId: 'fetch-flyers-error' });
    }
  };

  useEffect(() => {
    getEventFlyers();
  }, []);

  // CREATE - UPDATE
  const [open, setOpen] = useState(false);
    const [currentFlyer, setCurrentFlyer] = useState<EventFlyer | null>(null);
  
    const openAddEditPopup = (flyer: EventFlyer | null = null) => {
      setCurrentFlyer(flyer);
      setOpen(true);
    };
  
    const closeAddEditPopup = () => {
      setOpen(false);
    };
  
    const AddOrEditFlyer = async (id: string | null, formData: FormData): Promise<void> => {
      try {
        let newFlyer: EventFlyer;
  
        if (id && currentFlyer) {
          // met à jour l'événement existant
          newFlyer = await updateEventFlyerById(id, formData);
        } else {
          // crée un nouvel événement
          newFlyer = await createEventFlyer(formData);
        }
  
        if (id && currentFlyer) {
          // met à jour la liste des flyers
          setEventFlyers(eventFlyers.map((e) => (e.id === currentFlyer.id ? newFlyer : e)));
        } else {
          // ajoute le nouvel flyer à la liste
          setEventFlyers([...eventFlyers, newFlyer]);
        }
        toast.success("Record saved successfully");
      } catch (error) {
        console.error("Failed to save record:", error);
        toast.error("Failed to save record");
      }
    };

  // READ
  const [selectedFlyer, setSelectedFlyer] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
    
  const openFindByIdPopup = async (id: string) => {
    try {
      const fetchedFlyer = await findEventFlyerById(id);
      setSelectedFlyer(fetchedFlyer);
      setOpenModal(true); 
      toast.success("Flyer fetched successfully", { toastId: 'fetch-flyer-success' });
    } catch (error) {
      console.error("Failed to fetch flyer:", error);
      toast.error("Failed to fetch flyer", { toastId: 'fetch-flyer-error' });
    }
  };
    
  const closeFindByIdPopup = () => {
    setOpenModal(false);
  };

  // DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [flyerIdToDelete, setFlyerIdToDelete] = useState<string | null>(null);
    
  const openDeletePopup = (id: string) => {
    setFlyerIdToDelete(id);
    setOpenDelete(true);
  };
    
  const closeDeletePopup = () => {
    setOpenDelete(false);
    setFlyerIdToDelete(null);
  };
    
  const deleteFlyerById = async () => {
    if (!flyerIdToDelete) return;
    try {
      await deleteEventFlyerById(flyerIdToDelete);
      // rafraîchit la liste
      setEventFlyers(eventFlyers.filter((e) => e.id !== flyerIdToDelete));
      toast.success("Record deleted successfully");
      closeDeletePopup();
    } catch (error) {
      console.error("Failed to delete record :", error);
      toast.error("Failed to delete record");
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Flyers List</Typography>
        <IconButton aria-label="add" onClick={() => openAddEditPopup()} color="primary">
          <AddIcon />
        </IconButton>
        <EventFlyerPopup
          open={open}
          onClose={closeAddEditPopup}
          onSave={AddOrEditFlyer}
          flyer={currentFlyer}
        />
      </Box>
      <DataGrid
        rows={eventFlyers}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        getRowId={(row) => row.id}
        localeText={{
          toolbarQuickFilterPlaceholder: 'Search flyers...',
        }}
        showToolbar
      />

      {/* FIND BY ID POPUP */}
      <Dialog open={openModal} onClose={closeFindByIdPopup} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', direction: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CategoryIcon sx={{ mr: 1 }} />
            Détails du flyer
          </Box>
          <IconButton onClick={closeFindByIdPopup}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      
        <DialogContent dividers>
          {selectedFlyer && (
            <Grid container spacing={2}>
              <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  <img src={selectedFlyer.file_path || '/src/assets/default-flyer.png'} alt="Flyer" style={{ width: '100%', height: 'auto', maxHeight: 300 }} />
                </Typography>
                <Typography sx={{ p:2 }} variant="body2" color="text.secondary">
                  <strong>Identifiant : </strong>{selectedFlyer.id}<br/>
                  <strong>Filename : </strong>{selectedFlyer.file_name}<br/>
                  <strong>Filepath : </strong>{selectedFlyer.file_path}
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
        onConfirm={deleteFlyerById}
      />
    </Box>
  );
};

export default EventFlyers;