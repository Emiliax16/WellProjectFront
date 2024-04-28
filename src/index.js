import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Test from './Test';
import Home from './views/Home';
import Admin from './views/Admin/Admin';
import NewClient from './views/Clients/oneClient/NewClient';
import ClientList from './views/Clients/allClients/ClientList';
import ClientDetails from './views/Clients/oneClient/ClientDetails';
import CreateWell from './views/Clients/wellClients/CreateWell';
import ClientWells from './views/Clients/wellClients/ClientWells';
import WellReportList from './views/Clients/wellClients/reports/WellReportList';
import View from './views/View';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(  
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/admin" element={
            <PrivateRoute roles={['admin']}>
              <Admin />
            </PrivateRoute>
          } />
          <Route path="/view" element={<View />} />

          {/* Clientes */}
          {/* Crear */}
          <Route path="/clients/new" element={<NewClient />} />
          {/* Ver todos*/}
          <Route path="/clients" element={<ClientList />} />
          {/* Ver uno*/}
          <Route path="/clients/:id" element={<ClientDetails />} />
          {/* Crear un pozo */}
          <Route path="/clients/:id/wells/new" element={<CreateWell />} />
          {/* Ver pozos */}
          <Route path="/clients/:id/wells" element={<ClientWells />} />
          {/* Ver reportes de un pozo */}
          <Route path="/clients/:clientId/wells/:code" element={<WellReportList />} />
          

          <Route path="/*" element="404 Not Found" />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);


