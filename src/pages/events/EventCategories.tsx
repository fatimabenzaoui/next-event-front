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
import type { EventCategory } from '../../models/EventCategory';
import { createEventCategory, deleteEventCategoryById, findAllEventCategories, findEventCategoryById, updateEventCategory,  } from '../../services/EventCategoryService';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import EventCategoryPopup from './EventCategoryPopup';


const EventCategories = () => {
  // état pour stocker les catégories récupérées de l'API
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);

  // définition des colonnes pour le DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
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
  const loadEventCategories = async () => {
    try {
      const fetchedEventFlyers = await findAllEventCategories();
      setEventCategories(fetchedEventFlyers);
      toast.success("Categories fetched successfully", { toastId: 'fetch-flyers-success' });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to fetch categories", { toastId: 'fetch-flyers-error' });
    }
  };

  useEffect(() => {
    loadEventCategories();
  }, []);

  // CREATE - UPDATE
  const [open, setOpen] = useState(false);
  const [currentEventCategory, setCurrentEventCategory] = useState<EventCategory | null>(null);
  
  const openAddEditPopup = (category: EventCategory | null = null) => {
    setCurrentEventCategory(category);
    setOpen(true);
  };
  
  const closeAddEditPopup = () => {
    setOpen(false);
  };
  
  const AddOrEditEventCategory = async (id: number | null, data: Omit<EventCategory, "id">): Promise<void> => {
    try {
      let newEventCategory: EventCategory;
  
      if (id && currentEventCategory) {
        // met à jour la catégorie existante
        newEventCategory = await updateEventCategory(id, data);
      } else {
        // crée un nouvelle catégorie
        newEventCategory = await createEventCategory(data);
      }
  
      if (id && currentEventCategory) {
        // met à jour la liste des catégories
        setEventCategories(eventCategories.map((e) => (e.id === id ? newEventCategory : e)));
      } else {
        // ajoute la nouvelle catégorie à la liste
        setEventCategories([...eventCategories, newEventCategory]);
      }
      toast.success("Record saved successfully");
    } catch (error) {
      console.error("Failed to save record:", error);
      toast.error("Failed to save record");
    }
  };

  // READ
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  
  const openFindByIdPopup = async (id: string) => {
    try {
      const fetchedCategory = await findEventCategoryById(id);
      setSelectedCategory(fetchedCategory);
      setOpenModal(true); 
      toast.success("Event fetched successfully", { toastId: 'fetch-event-success' });
    } catch (error) {
      console.error("Failed to fetch event:", error);
      toast.error("Failed to fetch event", { toastId: 'fetch-event-error' });
    }
  };
  
  const closeFindByIdPopup = () => {
    setOpenModal(false);
  };

  // DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(null);
  
  const openDeletePopup = (id: number) => {
    setCategoryIdToDelete(id);
    setOpenDelete(true);
  };
  
  const closeDeletePopup = () => {
    setOpenDelete(false);
    setCategoryIdToDelete(null);
  };
  
  const deleteCategoryById = async () => {
    if (!categoryIdToDelete) return;
    try {
      await deleteEventCategoryById(categoryIdToDelete);
      // rafraîchit la liste
      setEventCategories(eventCategories.filter((e) => e.id !== categoryIdToDelete));
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
        <Typography variant="h6">Categories List</Typography>
        <IconButton aria-label="add" onClick={() => openAddEditPopup()} color="primary">
          <AddIcon />
        </IconButton>
        
        <EventCategoryPopup
          open={open}
          onClose={closeAddEditPopup}
          onSave={AddOrEditEventCategory}
          category={currentEventCategory}
        />
      </Box>
      <DataGrid
        rows={eventCategories}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        getRowId={(row) => row.id}
        localeText={{
          toolbarQuickFilterPlaceholder: 'Search categories...',
        }}
        showToolbar
      />

      {/* FIND BY ID POPUP */}
      <Dialog open={openModal} onClose={closeFindByIdPopup} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', direction: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CategoryIcon sx={{ mr: 1 }} />
            Détails de la catégorie
          </Box>
          <IconButton onClick={closeFindByIdPopup}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedCategory && (
            <Grid container spacing={2}>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Identifiant : {selectedCategory.id}
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Nom : {selectedCategory.name}
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
        onConfirm={deleteCategoryById}
      />
    </Box>
  );
};

export default EventCategories;

