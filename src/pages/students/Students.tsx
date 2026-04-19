import { Box, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, List, ListItem, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState, type SyntheticEvent } from "react";
import TabPanel from "../../components/TabPanel";
import type { Student } from "../../models/Student";
import type { Event } from "../../models/Event";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { createStudent, deleteStudentById, findAllStudents, findStudentById, getSuggestedEvents, updateStudent } from "../../services/StudentService";
import StudentPopup from "./StudentPopup";
import Participations from "./Participations";
import Hobbies from "./Hobbies";

function Students() {
  const [value, setValue] = useState(0);
  const handleChange = (_e: SyntheticEvent, newValue: number) => setValue(newValue);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.3 },
    { field: 'first_name', headerName: 'Prénom', flex: 1 },
    { field: 'last_name', headerName: 'Nom', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'school_name', headerName: 'École', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton onClick={() => openFindByIdPopup(params.row.id)}>
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
  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await findAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error("Failed to fetch students", { toastId: 'fetch-students-error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStudents(); }, []);

  // CREATE / UPDATE
  const [open, setOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  const openAddEditPopup = (student: Student | null = null) => {
    setCurrentStudent(student);
    setOpen(true);
  };

  const handleSave = async (id: number | null, data: Omit<Student, 'id' | 'school_name'>) => {
    try {
      if (id) {
        const updated = await updateStudent(id, data);
        setStudents(students.map((s) => (s.id === id ? updated : s)));
        toast.success("Student mis à jour");
      } else {
        const created = await createStudent(data);
        setStudents([...students, created]);
        toast.success("Student créé");
      }
    } catch (error) {
      console.error('Failed to save student:', error);
      toast.error("Échec de la sauvegarde");
    }
  };

  // READ + SUGGESTIONS
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [suggestedEvents, setSuggestedEvents] = useState<Event[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const openFindByIdPopup = async (id: number) => {
    try {
      const [data, suggestions] = await Promise.all([
        findStudentById(id),
        getSuggestedEvents(id),
      ]);
      setSelectedStudent(data);
      setSuggestedEvents(suggestions);
      setOpenModal(true);
    } catch {
      toast.error("Failed to fetch student");
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setSuggestedEvents([]);
  };

  // DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const openDeletePopup = (id: number) => {
    setIdToDelete(id);
    setOpenDelete(true);
  };

  const deleteStudent = async () => {
    if (!idToDelete) return;
    try {
      await deleteStudentById(idToDelete);
      setStudents(students.filter((s) => s.id !== idToDelete));
      toast.success("Student supprimé");
      setOpenDelete(false);
      setIdToDelete(null);
    } catch (error) {
      console.error('Failed to delete student:', error);
      toast.error("Échec de la suppression");
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
          <Tab label="Students" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Participations" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Hobbies" id="tab-2" aria-controls="tabpanel-2" />
        </Tabs>
      </Box>

      {/* STUDENTS */}
      <TabPanel value={value} index={0}>
        <Box sx={{ p: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Students List</Typography>
            <IconButton color="primary" onClick={() => openAddEditPopup()}>
              <AddIcon />
            </IconButton>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={students}
              columns={columns}
              initialState={{ pagination: { paginationModel: { pageSize: 25, page: 0 } } }}
              pageSizeOptions={[25, 50, 100]}
              getRowId={(row) => row.id}
              localeText={{ toolbarQuickFilterPlaceholder: 'Search students...' }}
              showToolbar
            />
          )}

          {/* FIND BY ID POPUP */}
          <Dialog open={openModal} onClose={closeModal} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Détails du student
              </Box>
              <IconButton onClick={closeModal}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {selectedStudent && (
                <>
                  <Grid container spacing={2}>
                    <Grid><Typography variant="body2" color="text.secondary">ID : {selectedStudent.id}</Typography></Grid>
                    <Grid><Typography variant="body2" color="text.secondary">Prénom : {selectedStudent.first_name}</Typography></Grid>
                    <Grid><Typography variant="body2" color="text.secondary">Nom : {selectedStudent.last_name}</Typography></Grid>
                    <Grid><Typography variant="body2" color="text.secondary">Email : {selectedStudent.email}</Typography></Grid>
                    <Grid><Typography variant="body2" color="text.secondary">École : {selectedStudent.school_name || '—'}</Typography></Grid>
                    <Grid>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Hobbies :</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedStudent.hobbies && selectedStudent.hobbies.length > 0
                          ? selectedStudent.hobbies.map((h) => <Chip key={h.id} label={h.name} size="small" />)
                          : <Typography variant="body2" color="text.disabled">—</Typography>
                        }
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Événements suggérés
                  </Typography>
                  {suggestedEvents.length > 0 ? (
                    <List dense disablePadding>
                      {suggestedEvents.map((event) => (
                        <ListItem key={event.id} disableGutters sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                          <ListItemText
                            primary={event.name}
                            secondary={
                              <>
                                <Chip label={event.category_name} size="small" color="primary" variant="outlined" sx={{ mr: 1 }} />
                                {event.start_date ? new Date(event.start_date).toLocaleDateString('fr-FR') : ''}
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.disabled">
                      Aucun événement correspondant aux hobbies de cet étudiant.
                    </Typography>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>

          <StudentPopup
            open={open}
            onClose={() => setOpen(false)}
            onSave={handleSave}
            student={currentStudent}
          />

          <ConfirmationDialog
            open={openDelete}
            onClose={() => { setOpenDelete(false); setIdToDelete(null); }}
            onConfirm={deleteStudent}
          />
        </Box>
      </TabPanel>

      {/* PARTICIPATIONS */}
      <TabPanel value={value} index={1}><Participations /></TabPanel>

      {/* HOBBIES */}
      <TabPanel value={value} index={2}><Hobbies /></TabPanel>
    </Box>
  );
}

export default Students;
