// Select.js
import React from 'react';

const Select = ({ name, label, register, options, classNameLabel, classNameSelect }) => {
  classNameLabel = classNameLabel || 'block text-sm font-medium leading-6 text-gray-900';
  classNameSelect = classNameSelect || 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6';
  
  return (
    <div className="flex flex-col col-span-full">
      <label>{name}</label>
      <div className="mt-2">
        <select className={classNameSelect} {...register(label)}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
        </select>
      </div>
    </div> 
  );
};

export default Select;
