import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Test from './Test';
import Admin from './views/Admin';
import View from './views/View';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(  
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/test" element={<Test />} />
          <Route path="/admin" element={ <Admin />} />
          <Route path="/view" element={<View />} />
          <Route path="/*" element="404 Not Found" />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);


