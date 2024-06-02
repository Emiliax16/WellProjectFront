
function numberFormat(number) {
    if (typeof number !== 'number') {
        // no debería nunca caer aquí porque el modelo no permite
        // que se guarde un string en el campo (pero por si acaso xd)
        return number;
      }
      
      const fixedNumber = number.toFixed(2);
      return fixedNumber;
}

export default numberFormat;