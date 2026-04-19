import { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Chip } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import type { EventParticipation, ParticipationStatus } from '../../models/EventParticipation';
import { createParticipation, deleteParticipationById, findAllParticipations, updateParticipationStatus } from '../../services/ParticipationService';
import ParticipationPopup from './ParticipationPopup';

const statusColor: Record<ParticipationStatus, 'default' | 'primary' | 'success' | 'error'> = {
  REGISTERED: 'default',
  CONFIRMED: 'primary',
  ATTENDED: 'success',
  CANCELLED: 'error',
};

const Participations = () => {
  const [participations, setParticipations] = useState<EventParticipation[]>([]);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<EventParticipation | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.3 },
    { field: 'student_name', headerName: 'Étudiant', flex: 1 },
    { field: 'event_name', headerName: 'Événement', flex: 1 },
    {
      field: 'status',
      headerName: 'Statut',
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value} color={statusColor[params.value as ParticipationStatus]} size="small" />
      ),
    },
    { field: 'registration_date', headerName: 'Date inscription', flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleDateString('fr-FR'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton onClick={() => { setCurrent(params.row); setOpen(true); }}>
            <EditIcon color="secondary" />
          </IconButton>
          <IconButton onClick={() => { setIdToDelete(params.row.id); setOpenDelete(true); }}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const load = async () => {
    try {
      const data = await findAllParticipations();
      setParticipations(data);
    } catch {
      toast.error('Failed to fetch participations');
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (id: number | null, data: { student: number; event: number; status: ParticipationStatus }) => {
    try {
      if (id) {
        const updated = await updateParticipationStatus(id, data.status);
        setParticipations(participations.map((p) => (p.id === id ? updated : p)));
      } else {
        const created = await createParticipation(data);
        setParticipations([...participations, created]);
      }
      toast.success('Record saved successfully');
    } catch {
      toast.error('Failed to save record');
    }
  };

  const handleDelete = async () => {
    if (!idToDelete) return;
    try {
      await deleteParticipationById(idToDelete);
      setParticipations(participations.filter((p) => p.id !== idToDelete));
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
        <Typography variant="h6">Participations</Typography>
        <IconButton color="primary" onClick={() => { setCurrent(null); setOpen(true); }}>
          <AddIcon />
        </IconButton>
      </Box>

      <DataGrid
        rows={participations}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 25, page: 0 } } }}
        pageSizeOptions={[25, 50, 100]}
        getRowId={(row) => row.id}
        showToolbar
      />

      <ParticipationPopup
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        participation={current}
      />

      <ConfirmationDialog
        open={openDelete}
        onClose={() => { setOpenDelete(false); setIdToDelete(null); }}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default Participations;
