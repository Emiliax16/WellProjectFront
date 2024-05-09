import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

// Link documentación de alertas: https://mui.com/material-ui/react-alert/
// Tipos actuales son: 'error', 'warning', 'info', 'success'

export default function BasicAlerts( { type, message } ) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity={type}>{message}</Alert>
    </Stack>
  );
}
