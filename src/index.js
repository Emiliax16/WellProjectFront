import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Test from './Test';
import LandingPage from './views/LandingPage';
import Admin from './views/Admin/Admin';
import Login from './views/Login';
import NewClient from './views/Clients/oneClient/NewClient';
import NewCompany from './views/Companies/oneCompany/NewCompany';
import EditCompany from './views/Companies/oneCompany/EditCompany';
import CompanyList from './views/Companies/allCompanies/CompanyList';
import CompanyDetails from './views/Companies/oneCompany/CompanyDetails';
import DeleteCompany from './views/Companies/oneCompany/DeleteCompany';
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

import Navbar from './components/navbar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(  
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <AuthProvider>
        <Router>
          <Navbar>
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
              {/* Empresas */}
              {/* Crear */}
              <Route path="/companies/new" element={
                <PrivateRoute roles={['admin']}>
                  <NewCompany />
                </PrivateRoute>
              } />
              { /* Ver todos */}
              <Route path="/companies" element={
                <PrivateRoute roles={['admin']}>
                  <CompanyList />
                </PrivateRoute>
              } />
              {/* Ver uno */}
              <Route path="/companies/:id" element={<CompanyDetails />} />
              {/* Editar una empresa */}
              <Route path="/companies/:id/edit" element={
                <PrivateRoute roles={['admin']}>
                  <EditCompany />
                </PrivateRoute>
              } />
              {/* Eliminar una empresa */}
              <Route path="/companies/:id/delete" element={
                <PrivateRoute roles={['admin']}>
                  <DeleteCompany />
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
          </Navbar>
        </Router>
      </AuthProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);


