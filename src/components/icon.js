// Input.js
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';

// Para agregar más íconos, se debe importar y agregar al objeto iconMap
// https://mui.com/components/material-icons/
const iconMap = {
  Refresh: RefreshIcon,
};

const Icon = ({ icon, classNameIcon, text, flexType="flex-col" }) => {
  const IconComponent = iconMap[icon];

  if (!IconComponent) {
    return<span className="text-gray-500">Ícono no encontrado</span>
  }

  return (
    <div className={`flex ${flexType} items-center justify-center min-h-screen`}>
      <IconComponent className={classNameIcon} />
      <span className="text-gray-500">{text}</span>
    </div>
  );
};


export default Icon;
