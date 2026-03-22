import "./custom-calendar.css";
import { useState, useEffect, type SyntheticEvent } from 'react';
import { Box, Chip, Grid, IconButton, Modal, Tab, Tabs, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';
import TabPanel from '../../components/TabPanel';
import type { Event } from '../../models/Event';
import { createEvent, deleteEventById, findAllEvents, findEventById, updateEventById } from '../../services/EventService';
import { formatDate } from '../../utils/dateFormat';
import EventFlyers from './EventFlyers';
import EventPopup from './EventPopup';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import EventCategories from './EventCategories';
import EventAddresses from './EventAddresses';
import BarChart from '../analytics/BarChart';
import { Line } from "react-chartjs-2";
import { getMainChartData, mainChartOptions } from "../analytics/ChartConfig";
import EventMap from '../../components/EventMap';
import Cities from './Cities';
import Associations from './Associations';
import BarChart2 from '../analytics/BarChart2';
import BarChart3 from '../analytics/BarChart3';
import BarChart4 from '../analytics/BarChart4';
import BarChart5 from '../analytics/BarChart5';


const Events = () => {

  // état pour gérer l'onglet actif
  const [value, setValue] = useState(0);
  // gère le changement d'onglet
  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // état pour stocker les événements récupérés de l'API
  const [events, setEvents] = useState<Event[]>([]);
  
  // définition des colonnes pour le DataGrid
  const columns: GridColDef[] = [
    {
      field: 'flyer',
      headerName: 'Flyer',
      flex: 0.5,
      renderCell: (params) => (
        <img
          src={params.row.flyer_path}
          alt="Flyer"
          loading="lazy"
          style={{ width: '100%', height: 'auto', margin: '0 auto', alignSelf: 'center' }}
        />
      ),
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'start_date', headerName: 'Start Date', flex: 1, type: 'dateTime', valueFormatter: (params) => formatDate(params)},
    { field: 'end_date', headerName: 'End Date', flex: 1, type: 'dateTime', valueFormatter: (params) => formatDate(params) },
    { field: 'street', headerName: 'Street', flex: 1, renderCell: (params) => (<div>{params.row.address?.street}</div>)},
    { field: 'zip_code', headerName: 'ZipCode', flex: 1, renderCell: (params) => (<div>{params.row.address?.zip_code}</div>)},
    { field: 'city_name', headerName: 'City', flex: 1, renderCell: (params) => (<div>{params.row.address.city.name}</div>)},
    { field: 'latitude', headerName: 'Latitude', flex: 1, renderCell: (params) => (<div>{params.row.address.latitude}</div>)},
    { field: 'longitude', headerName: 'Longitude', flex: 1, renderCell: (params) => (<div>{params.row.address.longitude}</div>)},
    { field: 'category_name', headerName: 'Category', flex: 1, renderCell: (params) => (<div>{params.row.category_name}</div>)},
    { field: 'association', headerName: 'Association', flex: 1, renderCell: (params) => (<div>{params.row.association?.name}</div>)},
    { field: 'school', headerName: 'School', flex: 1, renderCell: (params) => (<div>{params.row.association?.school?.name}</div>)},
    {
    field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        const isExpired = new Date(params.row.end_date) < new Date();
        return (
          <Chip
            label={isExpired ? 'ENDED' : 'IN PROGRESS'}
            color={isExpired ? 'error' : 'success'}
            variant="filled"
            size="small"
            sx={{
              fontWeight: 'bold',
              width: 'auto',
            }}
          />
        );
      },
    },
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

  // FIND ALL EVENTS
  const getEvents = async () => {
    try {
      const fetchedEvents = await findAllEvents();
      setEvents(fetchedEvents);
      toast.success("Events fetched successfully", {toastId: 'fetch-events-success'});
    } catch (error) {
      console.error("Failed to fetch event:", error);
      toast.error("Failed to fetch event", {toastId: 'fetch-events-error'});
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  // CREATE - UPDATE
  const [open, setOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const openAddEditPopup = (event: Event | null = null) => {
    setCurrentEvent(event);
    setOpen(true);
  };

  const closeAddEditPopup = () => {
    setOpen(false);
  };

  const AddOrEditEvent = async (id: number | null, formData: FormData): Promise<void> => {
    try {
      let newEvent: Event;

      if (id && currentEvent) {
        // met à jour l'événement existant
        newEvent = await updateEventById(id, formData);
      } else {
        // crée un nouvel événement
        newEvent = await createEvent(formData);
      }

      if (id && currentEvent) {
        // met à jour la liste des événements
        setEvents(events.map((e) => (e.id === currentEvent.id ? newEvent : e)));
      } else {
        // ajoute le nouvel événement à la liste
        setEvents([...events, newEvent]);
      }
      toast.success("Record saved successfully");
    } catch (error) {
      console.error("Failed to save record:", error);
      toast.error("Failed to save record");
    }
  };

  // READ
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

  const openFindByIdPopup = async (id: number) => {
    try {
      const fetchedEvent = await findEventById(id);
      setSelectedEvent(fetchedEvent);
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
  const [eventIdToDelete, setEventIdToDelete] = useState<number | null>(null);

  const openDeletePopup = (id: number) => {
    setEventIdToDelete(id);
    setOpenDelete(true);
  };

  const closeDeletePopup = () => {
    setOpenDelete(false);
    setEventIdToDelete(null);
  };

  const deleteEventByid = async () => {
    if (!eventIdToDelete) return;
    try {
      await deleteEventById(eventIdToDelete);
      // rafraîchit la liste
      setEvents(events.filter((e) => e.id !== eventIdToDelete));
      toast.success("Record deleted successfully");
      closeDeletePopup();
    } catch (error) {
      console.error("Failed to delete record :", error);
      toast.error("Failed to delete record");
    }
  };

  // CALENDRIER
  // définit la locale globale en français
  dayjs.locale('fr');

  // transforme un tableau d'événements en un format compatible avec un composant de calendrier
  const transformEventsForCalendar = (events: Event[]) => {
    return events.map((event) => {
      const start = dayjs(event.start_date).locale('fr');
      const end = dayjs(event.end_date).locale('fr');
      return {
        title: event.name,
        start: start.toDate(),
        end: end.toDate(),
      };
    });
  };

  // ANALYTICS
  const [chartData, setChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: 'Events',
        data: new Array(12).fill(0),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  });
  
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getMainChartData();
        setChartData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };
    fetchChartData();
  }, []);

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="events tabs"
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
          <Tab label="Calendar" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Map" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Events" id="tab-2" aria-controls="tabpanel-2" />
          <Tab label="Flyers" id="tab-3" aria-controls="tabpanel-3" />
          <Tab label="Addresses" id="tab-4" aria-controls="tabpanel-4" />
          <Tab label="Cities" id="tab-5" aria-controls="tabpanel-5" />
          <Tab label="Categories" id="tab-6" aria-controls="tabpanel-6" />
          <Tab label="Associations" id="tab-7" aria-controls="tabpanel-7" />
          <Tab label="Analytics" id="tab-8" aria-controls="tabpanel-8" />
        </Tabs>
      </Box>

      {/* CALENDAR */}
      <TabPanel value={value} index={0}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          locales={[frLocale]}
          locale="fr"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,list,'
          }}
          slotMinTime="07:00:00"
          slotMaxTime="24:00:00"
          allDaySlot={false}
          height="auto"
          // passe les événements transformés
          events={transformEventsForCalendar(events)}
          timeZone="local"
          slotLabelFormat={[
            { hour: '2-digit', minute: '2-digit', hour12: false }  // Format 24h
          ]}
        />
      </TabPanel>

      {/* MAP */}
      <TabPanel value={value} index={1}>
        {/* Carte des évènements */}
        <EventMap />
      </TabPanel>

      {/* EVENTS */}
      <TabPanel value={value} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Events List</Typography>
            <IconButton aria-label="add" onClick={() => openAddEditPopup()} color="primary">
              <AddIcon />
            </IconButton>
          <EventPopup
            open={open}
            onClose={closeAddEditPopup}
            onSave={AddOrEditEvent}
            event={currentEvent}
          />
        </Box>
        <DataGrid
          rows={events}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          getRowId={(row) => row.id}
          localeText={{
            toolbarQuickFilterPlaceholder: 'Search events...',
          }}
          showToolbar
        />
      </TabPanel>

      {/* FLYERS */}
      <TabPanel value={value} index={3}>
        <EventFlyers />
      </TabPanel>

      {/* ADDRESSES */}
      <TabPanel value={value} index={4}>
        <EventAddresses />
      </TabPanel>

      {/* CITIES */}
      <TabPanel value={value} index={5}>
        <Cities />
      </TabPanel>

      {/* CATEGORIES */}
      <TabPanel value={value} index={6}>
        <EventCategories />
      </TabPanel>

      {/* ASSOCIATIONS */}
      <TabPanel value={value} index={7}>
        <Associations />
      </TabPanel>

      {/* ANALYTICS */}
      <TabPanel value={value} index={8}>
          <Box sx={{ ...mainChart, flex: 1, height: '100%' }}>
            <Line options={mainChartOptions as any} data={chartData} />
          </Box>

          <Box sx={{ flex: 1, height: '100%' }}>
            <BarChart2 />
          </Box>

          <Box sx={{ flex: 1, height: '100%' }}>
            <BarChart3 />
          </Box>

          <Box sx={{ flex: 1, height: '100%' }}>
            <BarChart4 />
          </Box>

          <Box sx={{ flex: 1, height: '100%' }}>
            <BarChart5 />
          </Box>

          <Box sx={{ flex: 1, height: '100%' }}>
            <BarChart />
          </Box>
      </TabPanel>


      {/* FIND BY ID POPUP */}
      <Modal open={openModal} onClose={closeFindByIdPopup}>
        <Box sx={modalStyle}>
          {/* En-tête de la modale */}
          <Box sx={headerStyle}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Détails de l'événement
            </Typography>
            <IconButton onClick={closeFindByIdPopup} sx={{ color: 'text.secondary' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Contenu de la modale */}
          {selectedEvent && (
            <Box sx={contentStyle}>
              {/* Section "Infos générales" */}
              <Box sx={sectionStyle}>
                <Box>
                  <img src={selectedEvent.flyer_path} alt="Flyer" style={{ width: '100%', height: 'auto', margin: '0 auto' }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 1 }}>
                  <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Informations générales
                </Typography>
                <Grid container spacing={2}>
                  <Grid>
                    <Typography><strong>ID:</strong> {selectedEvent.id}</Typography>
                  </Grid>
                  <Grid>
                    <Typography><strong>Nom :</strong> {selectedEvent.name}</Typography>
                  </Grid>
                  <Grid>
                    <Typography>
                      <strong>Date de début :</strong> {formatDate(selectedEvent.start_date)}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography>
                      <strong>Date de fin :</strong> {formatDate(selectedEvent.end_date)}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography>
                      <strong>Lieu :</strong> {selectedEvent.address?.street || 'N/A'} {selectedEvent.address?.zip_code || ''} {selectedEvent.address?.city_name || ''}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography>
                      <strong>Latitude :</strong> {selectedEvent.address?.latitude || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography>
                      <strong>Longitude :</strong> {selectedEvent.address?.longitude || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography>
                      <strong>Nbre max de participants :</strong> {selectedEvent.max_participants}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Section "Description" */}
              <Box sx={sectionStyle}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Description
                </Typography>
                <Typography sx={descriptionStyle}>
                  {selectedEvent.description}
                </Typography>
              </Box>

              {/* Section "Type d'évènement" */}
              <Box sx={sectionStyle}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Type d'évènement
                </Typography>
                <Typography>
                  <Chip
                    label={selectedEvent.category_name}
                    color={'primary'}
                    variant="filled"
                    size="small"
                    sx={{
                      fontWeight: 'bold',
                      width: 'auto',
                    }}
                  />
                </Typography>
              </Box>

              {/* Section "Statut de l'évènement" */}
              <Box sx={sectionStyle}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Statut de l'évènement
                </Typography>
                <Typography>
                  <Chip
                    label={new Date(selectedEvent.end_date) > new Date() ? 'ENDED' : 'IN PROGRESS'}
                    color={new Date(selectedEvent.end_date) > new Date() ? 'error' : 'success'}
                    variant="filled"
                    size="small"
                    sx={{
                      fontWeight: 'bold',
                      width: 'auto',
                    }}
                  />
                </Typography>
              </Box>

            </Box>
          )}
        </Box>
      </Modal>

      {/* DELETE POPUP */}
      <ConfirmationDialog
        open={openDelete}
        onClose={closeDeletePopup}
        onConfirm={deleteEventByid}
      />

    </Box>
  );
}

export default Events;


/** @type {import("@mui/material").SxProps} */
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500, md: 600 },
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
  pb: 1,
  borderBottom: '1px solid',
  borderColor: 'divider',
};

const contentStyle = {
  mt: 1,
};

const sectionStyle = {
  mb: 3,
  pb: 2,
  borderBottom: '1px solid',
  borderColor: 'divider',
};

const descriptionStyle = {
  whiteSpace: 'pre-line',
  wordBreak: 'break-word',
  mt: 1,
};

const mainChart = {
  border: 1,
  borderColor: '#ddd',
  pt: 2,
  mt:5,
  borderRadius: 1,
};