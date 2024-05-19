import React from 'react';
import { Fab, Box } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhatsAppFab = () => {
  return (
    <Box
      component="a" // Hace que este componente funcione como si estuciera dentro de un tag <a>
      href="https://wa.me/989812204?text=Hola,%20tengo%20una%20consulta." // Link para abrir wsp cn un mensaje predefinido, telefono 98981 2204 es el telefono de Aike
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        position: 'fixed',
        bottom: (theme) => theme.spacing(2),
        right: (theme) => theme.spacing(2),
        textDecoration: 'none',
      }}
    >
      <Fab
        aria-label="whatsapp"
        sx={{
          backgroundColor: '#25D366',
          color: 'white',
          '&:hover': {
            backgroundColor: '#128C7E',
          },
        }}
      >
        <WhatsAppIcon />
      </Fab>
    </Box>
  );
};

export default WhatsAppFab;
