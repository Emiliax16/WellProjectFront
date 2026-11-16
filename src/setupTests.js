// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// CRA no carga .env.production en los tests: se fijan las rutas que usan.
process.env.REACT_APP_API_ENDPOINT_GET_USER_INFO = process.env.REACT_APP_API_ENDPOINT_GET_USER_INFO || 'users/data';
