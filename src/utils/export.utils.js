import * as XLSX from 'xlsx';

function processData(row) {
  const processedRow = {};
  Object.keys(row).forEach(key => {
    let value = row[key];
    if (typeof value === 'number') {
      processedRow[key] = value.toFixed(2);
    } else if (typeof value === 'string' && Date.parse(value)) {
      const date = new Date(value);
      processedRow[key] = date.toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    } else if (typeof value === 'string' && value.includes(':')) {
      const timePattern = /(\d{1,2}:\d{2})(:\d{2})?/;
      const match = value.match(timePattern);
      if (match) {
        processedRow[key] = match[1] + (match[2] ? match[2] : ':00');
      } else {
        processedRow[key] = value;
      }
    } else {
      processedRow[key] = value;
    }
  });
  return processedRow;
}

export const exportToExcel = (rows, filename) => {
  const processedRows = rows.map(row => processData(row));
  const worksheet = XLSX.utils.json_to_sheet(processedRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportMultipleToExcel = (rows, filename) => {
  const processedRows = rows.map(row => processData(row));
  const worksheet = XLSX.utils.json_to_sheet(processedRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
