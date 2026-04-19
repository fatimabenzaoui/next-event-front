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
import ConfirmationDialog from '../../components/ConfirmationDialog';
import type { City } from '../../models/City';
import { createCity, deleteCityById, findAllCities, findCityById, updateCity } from '../../services/CityService';
import CityPopup from './CityPopup';


const Cities = () => {
  // état pour stocker les villes récupérées de l'API
  const [cities, setCities] = useState<City[]>([]);

  // définition des colonnes pour le DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'zip_code', headerName: 'ZipCode', flex: 1 },
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
  const loadCitiess = async () => {
    try {
      const fetchedCities = await findAllCities();
      setCities(fetchedCities);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      toast.error("Failed to fetch cities", { toastId: 'fetch-cities-error' });
    }
  };

  useEffect(() => {
    loadCitiess();
  }, []);

  // CREATE - UPDATE
  const [open, setOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  
  const openAddEditPopup = (city: City | null = null) => {
    setCurrentCity(city);
    setOpen(true);
  };
  
  const closeAddEditPopup = () => {
    setOpen(false);
  };
  
  const AddOrEditCity = async (id: number | null, data: Omit<City, "id">): Promise<void> => {
    try {
      let newCity: City;
  
      if (id && currentCity) {
        // met à jour la ville existante
        newCity = await updateCity(id, data);
      } else {
        // crée un nouvelle ville
        newCity = await createCity(data);
      }
  
      if (id && currentCity) {
        // met à jour la liste des villes
        setCities(cities.map((c) => (c.id === id ? newCity : c)));
      } else {
        // ajoute la nouvelle ville à la liste
        setCities([...cities, newCity]);
      }
      toast.success("Record saved successfully");
    } catch (error) {
      console.error("Failed to save record:", error);
      toast.error("Failed to save record");
    }
  };

  // READ
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  
  const openFindByIdPopup = async (id: string) => {
    try {
      const fetchedCity = await findCityById(id);
      setSelectedCity(fetchedCity);
      setOpenModal(true); 
      toast.success("City fetched successfully", { toastId: 'fetch-city-success' });
    } catch (error) {
      console.error("Failed to fetch city:", error);
      toast.error("Failed to fetch city", { toastId: 'fetch-city-error' });
    }
  };
  
  const closeFindByIdPopup = () => {
    setOpenModal(false);
  };

  // DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [cityIdToDelete, setCityIdToDelete] = useState<number | null>(null);
  
  const openDeletePopup = (id: number) => {
    setCityIdToDelete(id);
    setOpenDelete(true);
  };
  
  const closeDeletePopup = () => {
    setOpenDelete(false);
    setCityIdToDelete(null);
  };
  
  const deleteCity = async () => {
    if (!cityIdToDelete) return;
    try {
      await deleteCityById(cityIdToDelete);
      // rafraîchit la liste
      setCities(cities.filter((c) => c.id !== cityIdToDelete));
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
        <Typography variant="h6">Cities List</Typography>
        <IconButton aria-label="add" onClick={() => openAddEditPopup()} color="primary">
          <AddIcon />
        </IconButton>
        
        <CityPopup
          open={open}
          onClose={closeAddEditPopup}
          onSave={AddOrEditCity}
          city={currentCity}
        />
      </Box>
      <DataGrid
        rows={cities}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        getRowId={(row) => row.id}
        localeText={{
          toolbarQuickFilterPlaceholder: 'Search cities...',
        }}
        showToolbar
      />

      {/* FIND BY ID POPUP */}
      <Dialog open={openModal} onClose={closeFindByIdPopup} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', direction: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CategoryIcon sx={{ mr: 1 }} />
            Détails de la ville
          </Box>
          <IconButton onClick={closeFindByIdPopup}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedCity && (
            <Grid container spacing={2}>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Identifiant : {selectedCity.id}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Nom : {selectedCity.name}
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
        onConfirm={deleteCity}
      />
    </Box>
  );
};

export default Cities;