import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Autocomplete, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Student } from '../../models/Student';
import type { School } from '../../models/School';
import type { Hobby } from '../../models/Hobby';
import { findAllSchools } from '../../services/SchoolService';
import { findAllHobbies } from '../../services/HobbyService';

interface StudentPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: Omit<Student, 'id' | 'school_name'>) => Promise<void>;
  student: Student | null;
}

const StudentPopup: React.FC<StudentPopupProps> = ({ open, onClose, onSave, student }) => {
  const [firstName, setFirstName] = useState(student?.first_name || '');
  const [lastName, setLastName] = useState(student?.last_name || '');
  const [email, setEmail] = useState(student?.email || '');
  const [emailError, setEmailError] = useState('');
  const [schoolId, setSchoolId] = useState<number | null>(student?.school_id || null);
  const [selectedHobbies, setSelectedHobbies] = useState<Hobby[]>(student?.hobbies || []);
  const [schools, setSchools] = useState<School[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);

  useEffect(() => {
    setFirstName(student?.first_name || '');
    setLastName(student?.last_name || '');
    setEmail(student?.email || '');
    setEmailError('');
    setSchoolId(student?.school_id || null);
    setSelectedHobbies(student?.hobbies || []);
  }, [student]);

  useEffect(() => {
    findAllSchools().then(setSchools).catch(console.error);
    findAllHobbies().then(setHobbies).catch(console.error);
  }, []);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(value && !isValidEmail(value) ? 'Email invalide' : '');
  };

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) return;
    if (!isValidEmail(email)) {
      setEmailError('Email invalide');
      return;
    }
    await onSave(student?.id || null, {
      first_name: firstName,
      last_name: lastName,
      email,
      school_id: schoolId ?? undefined,
      hobby_ids: selectedHobbies.map((h) => h.id),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={headerStyle}>
        {student ? 'Modifier le student' : 'Ajouter un student'}
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Prénom"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Nom"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />
        <Autocomplete
          options={schools}
          getOptionLabel={(option) => option.name}
          value={schools.find((s) => s.id === schoolId) || null}
          onChange={(_e, newValue) => setSchoolId(newValue?.id || null)}
          renderInput={(params) => (
            <TextField {...params} margin="dense" label="École" fullWidth />
          )}
        />
        <Autocomplete
          multiple
          options={hobbies}
          getOptionLabel={(option) => option.name}
          value={selectedHobbies}
          onChange={(_e, newValue) => setSelectedHobbies(newValue)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option.name} size="small" {...getTagProps({ index })} key={option.id} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} margin="dense" label="Hobbies" fullWidth />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary">Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentPopup;

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
  pb: 1,
  borderBottom: '1px solid',
  borderColor: 'divider',
};
