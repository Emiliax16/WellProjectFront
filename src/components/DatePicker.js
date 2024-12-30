import React from 'react';
import { MenuItem, FormControl, Select, InputLabel } from '@mui/material';

const months = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

const currentYear = new Date().getFullYear();
const years = [];
for (let y = currentYear; y >= 2024; y--) {
  years.push(y);
}

function DatePicker({ selectedMonth, selectedYear, handleMonthChange, handleYearChange }) {
  return (
    <div style={{ display: 'flex', marginBottom: '20px', marginTop: '20px', paddingLeft: '20px' }}>
      <FormControl variant="outlined" style={{ marginRight: '20px', minWidth: 120 }}>
        <InputLabel id="month-label">Mes</InputLabel>
        <Select
          labelId="month-label"
          value={selectedMonth}
          onChange={handleMonthChange}
          label="Mes"
        >
          {months.map((month) => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ minWidth: 120 }}>
        <InputLabel id="year-label">Año</InputLabel>
        <Select
          labelId="year-label"
          value={selectedYear}
          onChange={handleYearChange}
          label="Año"
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default DatePicker;
