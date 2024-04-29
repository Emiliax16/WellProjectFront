// Input.js
import React from 'react';

const Input = ({ name, label, placeholder, register, validation, classNameLabel, classNameInput, errors }) => {
  classNameLabel = classNameLabel || 'block text-sm font-medium leading-6 text-gray-900';
  classNameInput = classNameInput || 'block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6';
  console.log(errors[label])
  return (
    <div className="flex flex-col col-span-full">
      <label className={classNameLabel}>{name}</label>
      <div className="mt-2">
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
          <input className={classNameInput} placeholder={placeholder} {...register(label, validation)} />
        </div>
        {errors[label] && <p className="mt-2 text-sm text-red-600">{errors[label].message}</p>}
      </div>
    </div>
  );
};


export default Input;
