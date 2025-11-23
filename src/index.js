import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Test from './Test';
import LandingPage from './views/LandingPage';
import Admin from './views/Admin/Admin';
import AdminNew from './views/Admin/AdminNew';
import Login from './views/Login';
import NewClient from './views/Clients/oneClient/NewClient';
import NewCompany from './views/Companies/oneCompany/NewCompany';
import EditCompany from './views/Companies/oneCompany/EditCompany';
import CompanyList from './views/Companies/allCompanies/CompanyList';
import CompanyDetails from './views/Companies/oneCompany/CompanyDetails';
import ClientsByCompany from './views/Companies/oneCompany/ClientsByCompany';
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
import { ThemeProvider } from './components/ThemeProvider';
import PrivateRoute from './components/PrivateRoute';

import { Sidebar } from './components/Sidebar';
import DistributorList from './views/Distributors/allDistributors/DistributorList';
import NewDistributor from './views/Distributors/oneDistributor/NewDistributor';
import EditDistributor from './views/Distributors/oneDistributor/EditDistributor';
import DistributorDetails from './views/Distributors/oneDistributor/DistributorDetails';
import DeleteDistributor from './views/Distributors/oneDistributor/DeleteDistributor';
import CompaniesByDistributor from './views/Distributors/oneDistributor/CompaniesByDistributor';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="wellproject-theme">
      <StyledEngineProvider injectFirst>
        <AuthProvider>
          <Router>
            <Sidebar>
              <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/telemetria" element={<Telemetria />} />
              <Route path="/login" element={<Login />} />
              <Route path="/test" element={<Test />} />
              <Route path="/admin" element={
                <PrivateRoute roles={['admin']}>
                  <AdminNew />
                </PrivateRoute>
              } />
              <Route path="/admin/old" element={
                <PrivateRoute roles={['admin']}>
                  <Admin />
                </PrivateRoute>
              } />
              <Route path="/view" element={<View />} />

              {/* Clientes */}
              {/* Crear */}
              <Route path="/clients/new" element={
                <PrivateRoute roles={['admin', 'company']}>
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
                <PrivateRoute roles={['admin', 'company', 'normal']}>
                  <CreateWell />
                </PrivateRoute>
              } />
              {/* Editar un cliente */}
              <Route path="/clients/:id/edit" element={
                <PrivateRoute roles={['admin', 'company']}>
                  <EditClient />
                </PrivateRoute>            
              } />
              {/* Eliminar un cliente */}
              <Route path="/clients/:id/delete" element={
                <PrivateRoute roles={['admin', 'company']}>
                  <DeleteClient />
                </PrivateRoute>
              } />
              {/* Empresas */}
              {/* Crear */}
              <Route path="/companies/new" element={
                <PrivateRoute roles={['admin', 'distributor']}>
                  <NewCompany />
                </PrivateRoute>
              } />
              { /* Ver todos */}
              <Route path="/companies" element={
                <PrivateRoute roles={['admin', 'distributor']}>
                  <CompanyList />
                </PrivateRoute>
              } />
              {/* Ver uno */}
              <Route path="/companies/:id" element={<CompanyDetails />} />
              {/* Ver clientes de una empresa */}
              <Route path="/companies/:id/clients" element={<ClientsByCompany />} />
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
                <PrivateRoute roles={['admin', 'company', 'normal']}>
                  <EditWell />
                </PrivateRoute>
              } 
              />
              {/* Eliminar un pozo */}
              <Route path="/clients/:id/wells/:code/delete" element={
                <PrivateRoute roles={['admin', 'company', 'normal']}>
                  <DeleteWell />
                </PrivateRoute>
              } />
              {/* Distribuidoras */}
              {/* Crear */}
              <Route path="/distributors/new" element={
                <PrivateRoute roles={['admin']}>
                  <NewDistributor/>
                </PrivateRoute>
              } />
              {/* Ver todos */}
              <Route path="/distributors" element={
                <PrivateRoute roles={['admin']}>
                  <DistributorList />
                </PrivateRoute>
              } />
              {/* Ver uno */}
              <Route path="/distributors/:id" element={<DistributorDetails />} />
              {/* Editar una distribuidora */}
              <Route path="/distributors/:id/edit" element={
                <PrivateRoute roles={['admin']}>
                  <EditDistributor />
                </PrivateRoute>
              } />
              {/* Eliminar una distribuidora */}
              <Route path="/distributors/:id/delete" element={
                <PrivateRoute roles={['admin']}>
                  <DeleteDistributor />
                </PrivateRoute>
              } />
              {/* Ver empresas de la distribuidora */}
              <Route path="/distributors/:id/companies" element={<CompaniesByDistributor />} />
              <Route path="/*" element="404 Not Found" />
              </Routes>
            </Sidebar>
          </Router>
        </AuthProvider>
      </StyledEngineProvider>
    </ThemeProvider>
  </React.StrictMode>
);


