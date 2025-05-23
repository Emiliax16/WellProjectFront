import React from 'react';
import Logo from "../assets/img/logo.webp";
import { useAuth } from '../context/AuthContext';
import landingPageText from "../texts/landingPageText.json";

const LandingPageNavbar = ({ from }) => {
  const { user, logout } = useAuth();
  return (
    <header className="bg-gray-800 sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-white font-bold text-xl">
            <img src={Logo} alt="Logo" className="h-10 w-10" />
          </div>
          <div>
            { from === landingPageText.navbar.principalPage ?
              <a href='/telemetria' className="text-white hover:text-blue-200">{landingPageText.navbar.secondaryPage}</a>
              :
              <a href='/' className="text-white hover:text-blue-200">{landingPageText.navbar.principalPage}</a>
            }
          </div>
          <div className="md:block">
            <ul className="flex items-center space-x-8">
              {
                user ?
                <li><button onClick={logout} className="text-white hover:text-blue-200"> {landingPageText.navbar.logout} </button></li>
                :
                <li><a href="/login" className="text-white hover:text-blue-200"> {landingPageText.navbar.login} </a></li>
              }
            </ul>
          </div>
        </div>          
      </nav>
    </header>
  )
};


export default LandingPageNavbar;
