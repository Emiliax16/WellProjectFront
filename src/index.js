import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Test from './Test';
import LandingPage from './views/LandingPage';
import Admin from './views/Admin/Admin';
import Login from './views/Login';
import NewClient from './views/Clients/oneClient/NewClient';
import ClientList from './views/Clients/allClients/ClientList';
import ClientDetails from './views/Clients/oneClient/ClientDetails';
import EditClient from './views/Clients/oneClient/EditClient';
import DeleteClient from './views/Clients/oneClient/DeleteClient';
import CreateWell from './views/Clients/wellClients/CreateWell';
import ClientWells from './views/Clients/wellClients/ClientWells';
import EditWell from './views/Clients/wellClients/EditWell';
import DeleteWell from './views/Clients/wellClients/DeleteWell';
import WellReportList from './views/Clients/wellClients/reports/WellReportList';
import Telemetria from './views/Telemetria';
import View from './views/View';
import { StyledEngineProvider } from '@mui/material/styles';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(  
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/telemetria" element={<Telemetria />} />
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<Test />} />
            <Route path="/admin" element={
              <PrivateRoute roles={['admin']}>
                <Admin />
              </PrivateRoute>
            } />
            <Route path="/view" element={<View />} />

            {/* Clientes */}
            {/* Crear */}
            <Route path="/clients/new" element={
              <PrivateRoute roles={['admin']}>
                <NewClient />
              </PrivateRoute>
            } />
            {/* Ver todos*/}
            <Route path="/clients" element={
              <PrivateRoute roles={['admin']}>
                <ClientList />
              </PrivateRoute>
            } />
            {/* Ver uno*/}
            <Route path="/clients/:id" element={<ClientDetails />} />
            {/* Crear un pozo */}
            <Route path="/clients/:id/wells/new" element={
              <PrivateRoute roles={['admin']}>
                <CreateWell />
              </PrivateRoute>
            } />
            {/* Editar un cliente */}
            <Route path="/clients/:id/edit" element={
              <PrivateRoute roles={['admin']}>
                <EditClient />
              </PrivateRoute>            
            } />
            {/* Eliminar un cliente */}
            <Route path="/clients/:id/delete" element={
              <PrivateRoute roles={['admin']}>
                <DeleteClient />
              </PrivateRoute>
            } />
            {/* Ver pozos */}
            <Route path="/clients/:id/wells" element={<ClientWells />} />
            {/* Ver reportes de un pozo */}
            <Route path="/clients/:clientId/wells/:code" element={<WellReportList />} />
            {/* Editar un pozo */}
            <Route path="/clients/:id/wells/:code/edit" element={
              <PrivateRoute roles={['admin']}>
                <EditWell />
              </PrivateRoute>
            } 
            />
            {/* Eliminar un pozo */}
            <Route path="/clients/:id/wells/:code/delete" element={
              <PrivateRoute roles={['admin']}>
                <DeleteWell />
              </PrivateRoute>
            } />
            <Route path="/*" element="404 Not Found" />
          </Routes>
        </Router>
      </AuthProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);


