// Input.js
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import ConstructionIcon from '@mui/icons-material/Construction';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ChatIcon from '@mui/icons-material/Chat';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';

// Para agregar más íconos, se debe importar y agregar al objeto iconMap
// https://mui.com/components/material-icons/
const iconMap = {
  Refresh: RefreshIcon,
  Construction: ConstructionIcon,
  ContentPasteSearch: ContentPasteSearchIcon,
  Chat: ChatIcon,
  HomeWork: HomeWorkIcon,
  WorkOutline: WorkOutlineIcon,
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  X: XIcon,
};

const Icon = ({ icon, classNameIcon, classNameDiv, text=""}) => {
  const IconComponent = iconMap[icon];
  classNameDiv = classNameDiv || 'flex flex-col items-center justify-center my-2';

  if (!IconComponent) {
    return<span className="text-gray-500">Ícono no encontrado</span>
  }

  return (
    <div className={classNameDiv}>
      <IconComponent className={classNameIcon} />
      {
        text.length > 0 ? <span className="text-gray-500">{text}</span> : null
      }
    </div>
  );
};


export default Icon;
