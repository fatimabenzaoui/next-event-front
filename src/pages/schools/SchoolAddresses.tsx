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
import ConfirmationDialog from '../../components/ConfirmationDialog';
import type { SchoolAddress } from '../../models/SchoolAddress';
import { createSchoolAddress, deleteSchoolAddressById, findAllSchoolAddresses, findSchoolAddressById, updateSchoolAddress } from '../../services/SchoolAddressService';
import SchoolAddressPopup from './SchoolAddressPopup';

const SchoolAddresses = () => {
  // état pour stocker les adresses récupérées de l'API
  const [schoolAddresses, setSchoolAddresses] = useState<SchoolAddress[]>([]);

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
  const getSchoolAddresses = async () => {
    try {
      const fetchedSchoolAddresses = await findAllSchoolAddresses();
      setSchoolAddresses(fetchedSchoolAddresses);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      toast.error("Failed to fetch addresses", { toastId: 'fetch-addresses-error' });
    }
  };

  useEffect(() => {
    getSchoolAddresses();
  }, []);

  // CREATE - UPDATE
  const [open, setOpen] = useState(false);
  const [currentSchoolAddress, setCurrentSchoolAddress] = useState<SchoolAddress | null>(null);
    
  const openAddEditPopup = (address: SchoolAddress | null = null) => {
    setCurrentSchoolAddress(address);
    setOpen(true);
  };
    
  const closeAddEditPopup = () => {
    setOpen(false);
  };
    
  const AddOrEditSchoolAddress = async (id: number | null, data: Omit<SchoolAddress, "id">): Promise<void> => {
    try {
      let newSchoolAddress: SchoolAddress;
    
      if (id && currentSchoolAddress) {
        // met à jour l'adresse existante
        newSchoolAddress = await updateSchoolAddress(id, data);
      } else {
        // crée un nouvelle adresse
        newSchoolAddress = await createSchoolAddress(data);
      }
    
      if (id && currentSchoolAddress) {
        // met à jour la liste des adresses
        setSchoolAddresses(schoolAddresses.map((e) => (e.id === id ? newSchoolAddress : e)));
      } else {
        // ajoute la nouvelle adresse à la liste
        setSchoolAddresses([...schoolAddresses, newSchoolAddress]);
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
      const fetchedAddress = await findSchoolAddressById(id);
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
      await deleteSchoolAddressById(addressIdToDelete);
      // rafraîchit la liste
      setSchoolAddresses(schoolAddresses.filter((e) => e.id !== addressIdToDelete));
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
        <SchoolAddressPopup
          open={open}
          onClose={closeAddEditPopup}
          onSave={AddOrEditSchoolAddress}
          address={currentSchoolAddress}
        />
      </Box>
      <DataGrid
        rows={schoolAddresses}
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
                Address : {selectedAddress.street} {" "} {selectedAddress.zip_code} {" "} {selectedAddress.city}
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

export default SchoolAddresses;