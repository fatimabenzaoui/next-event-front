import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Autocomplete, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { EventParticipation, ParticipationStatus } from '../../models/EventParticipation';
import type { Student } from '../../models/Student';
import type { Event } from '../../models/Event';
import { findAllStudents } from '../../services/StudentService';
import { findAllEvents } from '../../services/EventService';

const STATUSES: ParticipationStatus[] = ['REGISTERED', 'CONFIRMED', 'ATTENDED', 'CANCELLED'];

interface ParticipationPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: { student: number; event: number; status: ParticipationStatus }) => Promise<void>;
  participation: EventParticipation | null;
}

const ParticipationPopup: React.FC<ParticipationPopupProps> = ({ open, onClose, onSave, participation }) => {
  const [studentId, setStudentId] = useState<number | null>(participation?.student || null);
  const [eventId, setEventId] = useState<number | null>(participation?.event || null);
  const [status, setStatus] = useState<ParticipationStatus>(participation?.status || 'REGISTERED');
  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setStudentId(participation?.student || null);
    setEventId(participation?.event || null);
    setStatus(participation?.status || 'REGISTERED');
  }, [participation]);

  useEffect(() => {
    findAllStudents().then(setStudents).catch(console.error);
    findAllEvents().then(setEvents).catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!studentId || !eventId) return;
    await onSave(participation?.id || null, { student: studentId, event: eventId, status });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={headerStyle}>
        {participation ? 'Modifier la participation' : 'Inscrire un étudiant'}
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Autocomplete
          options={students}
          getOptionLabel={(s) => `${s.first_name} ${s.last_name}`}
          value={students.find((s) => s.id === studentId) || null}
          onChange={(_e, v) => setStudentId(v?.id || null)}
          disabled={!!participation}
          renderInput={(params) => (
            <TextField {...params} margin="dense" label="Étudiant" fullWidth required />
          )}
        />
        <Autocomplete
          options={events}
          getOptionLabel={(e) => e.name || ''}
          value={events.find((e) => e.id === eventId) || null}
          onChange={(_e, v) => setEventId(v?.id || null)}
          disabled={!!participation}
          renderInput={(params) => (
            <TextField {...params} margin="dense" label="Événement" fullWidth required />
          )}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Statut</InputLabel>
          <Select
            value={status}
            label="Statut"
            onChange={(e) => setStatus(e.target.value as ParticipationStatus)}
          >
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary" disabled={!studentId || !eventId}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParticipationPopup;

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
  pb: 1,
  borderBottom: '1px solid',
  borderColor: 'divider',
};
