import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function PasswordDialog({ open, onClose, onConfirm, defaultAction = 'eliminación', defaultPath = '/clients' }) {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleConfirm = () => {
    onConfirm(password);
    setPassword('');
  };

  const handleClose = () => {
    onClose();
    navigate(defaultPath);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirmar {defaultAction}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Contraseña"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleConfirm} color="primary">Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PasswordDialog;
