import React from 'react';
import Logo from "../assets/img/img5.webp";
import { useAuth } from '../context/AuthContext';
import landingPageText from "../texts/landingPageText.json";

const LandingPageNavbar = () => {
  const { user, logout } = useAuth();
  return (
    <header class="bg-gray-800 sticky top-0 z-50">
      <nav class="container mx-auto px-6 py-3">
        <div class="flex items-center justify-between">
          <div class="text-white font-bold text-xl">
            <img src={Logo} alt="Logo" className="h-10 w-10" />
          </div>
          <div class="md:block">
            <ul class="flex items-center space-x-8">
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
