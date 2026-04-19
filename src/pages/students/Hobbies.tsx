import { useState, useEffect } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined';
import type { Hobby } from '../../models/Hobby';
import { findAllHobbies, createHobby, updateHobby, deleteHobbyById } from '../../services/HobbyService';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import HobbyPopup from './HobbyPopup';

const Hobbies = () => {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.3 },
    { field: 'name', headerName: 'Nom', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton onClick={() => openFindByIdPopup(params.row)}>
            <VisibilityIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => openAddEditPopup(params.row)}>
            <EditIcon color="secondary" />
          </IconButton>
          <IconButton onClick={() => openDeletePopup(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // FIND ALL
  const loadHobbies = async () => {
    try {
      const data = await findAllHobbies();
      setHobbies(data);
    } catch {
      toast.error('Failed to fetch hobbies', { toastId: 'fetch-hobbies-error' });
    }
  };

  useEffect(() => { loadHobbies(); }, []);

  // CREATE / UPDATE
  const [open, setOpen] = useState(false);
  const [currentHobby, setCurrentHobby] = useState<Hobby | null>(null);

  const openAddEditPopup = (hobby: Hobby | null = null) => {
    setCurrentHobby(hobby);
    setOpen(true);
  };

  const handleSave = async (id: number | null, data: Omit<Hobby, 'id'>) => {
    try {
      if (id) {
        const updated = await updateHobby(id, data);
        setHobbies(hobbies.map((h) => (h.id === id ? updated : h)));
      } else {
        const created = await createHobby(data);
        setHobbies([...hobbies, created]);
      }
      toast.success('Record saved successfully');
    } catch {
      toast.error('Failed to save record');
    }
  };

  // READ
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const openFindByIdPopup = (hobby: Hobby) => {
    setSelectedHobby(hobby);
    setOpenModal(true);
  };

  // DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const openDeletePopup = (id: number) => {
    setIdToDelete(id);
    setOpenDelete(true);
  };

  const deleteHobby = async () => {
    if (!idToDelete) return;
    try {
      await deleteHobbyById(idToDelete);
      setHobbies(hobbies.filter((h) => h.id !== idToDelete));
      toast.success('Record deleted successfully');
      setOpenDelete(false);
      setIdToDelete(null);
    } catch {
      toast.error('Failed to delete record');
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Hobbies List</Typography>
        <IconButton color="primary" onClick={() => openAddEditPopup()}>
          <AddIcon />
        </IconButton>
      </Box>

      <DataGrid
        rows={hobbies}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 25, page: 0 } } }}
        pageSizeOptions={[25, 50, 100]}
        getRowId={(row) => row.id}
        localeText={{ toolbarQuickFilterPlaceholder: 'Search hobbies...' }}
        showToolbar
      />

      {/* FIND BY ID POPUP */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InterestsOutlinedIcon sx={{ mr: 1 }} />
            Détails du hobby
          </Box>
          <IconButton onClick={() => setOpenModal(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedHobby && (
            <Grid container spacing={2}>
              <Grid><Typography variant="body2" color="text.secondary">ID : {selectedHobby.id}</Typography></Grid>
              <Grid><Typography variant="body2" color="text.secondary">Nom : {selectedHobby.name}</Typography></Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      <HobbyPopup
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        hobby={currentHobby}
      />

      <ConfirmationDialog
        open={openDelete}
        onClose={() => { setOpenDelete(false); setIdToDelete(null); }}
        onConfirm={deleteHobby}
      />
    </Box>
  );
};

export default Hobbies;
