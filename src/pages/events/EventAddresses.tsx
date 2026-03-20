import { useState, useEffect } from 'react';
import { Box, Card, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import type { EventAddress } from '../../models/EventAddress';
import { createEventAddress, deleteEventAddressById, findAllEventAddresses, findEventAddressById, updateEventAddress } from '../../services/EventAddressService';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import EventAddressPopup from './EventAddressPopup';

const EventAddresses = () => {
  // état pour stocker les adresses récupérées de l'API
  const [eventAddresses, setEventAddresses] = useState<EventAddress[]>([]);

  // définition des colonnes pour le DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.1 },
    { field: 'street', headerName: 'Street', flex: 1 },
    { field: 'zip_code', headerName: 'ZipCode', flex: 1 },
    { field: 'city_name', headerName: 'City', flex: 1,  renderCell: (params) => (<div>{params.row.city?.name}</div>)},
    { field: 'latitude', headerName: 'Latitude', flex: 1,  renderCell: (params) => (<div>{params.row.latitude}</div>)},
    { field: 'longitude', headerName: 'Longitude', flex: 1,  renderCell: (params) => (<div>{params.row.longitude}</div>)},
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
  const getEventAddresses = async () => {
    try {
      const fetchedEventAddresses = await findAllEventAddresses();
      setEventAddresses(fetchedEventAddresses);
      toast.success("Addresses fetched successfully", { toastId: 'fetch-addresses-success' });
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      toast.error("Failed to fetch addresses", { toastId: 'fetch-addresses-error' });
    }
  };

  useEffect(() => {
    getEventAddresses();
  }, []);

  // CREATE - UPDATE
  const [open, setOpen] = useState(false);
  const [currentEventAddress, setCurrentEventAddress] = useState<EventAddress | null>(null);
    
    const openAddEditPopup = (address: EventAddress | null = null) => {
      setCurrentEventAddress(address);
      setOpen(true);
    };
    
    const closeAddEditPopup = () => {
      setOpen(false);
    };
    
    const AddOrEditEventAddress = async (id: number | null, data: Omit<EventAddress, "id">): Promise<void> => {
      try {
        let newEventAddress: EventAddress;
    
        if (id && currentEventAddress) {
          // met à jour l'adresse existante
          newEventAddress = await updateEventAddress(id, data);
        } else {
          // crée un nouvelle adresse
          newEventAddress = await createEventAddress(data);
        }
    
        if (id && currentEventAddress) {
          // met à jour la liste des adresses
          setEventAddresses(eventAddresses.map((e) => (e.id === id ? newEventAddress : e)));
        } else {
          // ajoute la nouvelle adresse à la liste
          setEventAddresses([...eventAddresses, newEventAddress]);
        }
        toast.success("Record saved successfully");
      } catch (error) {
        console.error("Failed to save record:", error);
        toast.error("Failed to save record");
      }
    };

  // READ
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
    
  const openFindByIdPopup = async (id: number) => {
    try {
      const fetchedAddress = await findEventAddressById(id);
      setSelectedAddress(fetchedAddress);
      setOpenModal(true); 
      toast.success("Address fetched successfully", { toastId: 'fetch-address-success' });
    } catch (error) {
      console.error("Failed to fetch address:", error);
      toast.error("Failed to fetch address", { toastId: 'fetch-address-error' });
    }
  };
    
    const closeFindByIdPopup = () => {
      setOpenModal(false);
    };

  // DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [addressIdToDelete, setAddressIdToDelete] = useState<number | null>(null);
    
  const openDeletePopup = (id: number) => {
    setAddressIdToDelete(id);
    setOpenDelete(true);
  };
    
  const closeDeletePopup = () => {
    setOpenDelete(false);
    setAddressIdToDelete(null);
  };
    
  const deleteAddressById = async () => {
    if (!addressIdToDelete) return;
    try {
      await deleteEventAddressById(addressIdToDelete);
      // rafraîchit la liste
      setEventAddresses(eventAddresses.filter((e) => e.id !== addressIdToDelete));
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
        <Typography variant="h6">Addresses List</Typography>
        <IconButton aria-label="add" onClick={() => openAddEditPopup()} color="primary">
          <AddIcon />
        </IconButton>
        <EventAddressPopup
          open={open}
          onClose={closeAddEditPopup}
          onSave={AddOrEditEventAddress}
          address={currentEventAddress}
        />
      </Box>
      <DataGrid
        rows={eventAddresses}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        getRowId={(row) => row.id}
        localeText={{
          toolbarQuickFilterPlaceholder: 'Search addresses...',
        }}
        showToolbar
      />

      {/* FIND BY ID POPUP */}
      <Dialog open={openModal} onClose={closeFindByIdPopup} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', direction: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CategoryIcon sx={{ mr: 1 }} />
              Détails de l'adresse
          </Box>
          <IconButton onClick={closeFindByIdPopup}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedAddress && (
            <Card sx={{p:2}}>
              <Typography variant="body2" color="text.secondary">
                Identifiant : {selectedAddress.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Address : {selectedAddress.street} {" "} {selectedAddress.zip_code} {" "} {selectedAddress.city.name}
              </Typography>
            </Card>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE POPUP */}
      <ConfirmationDialog
        open={openDelete}
        onClose={closeDeletePopup}
        onConfirm={deleteAddressById}
      />
    </Box>
  );
};

export default EventAddresses;