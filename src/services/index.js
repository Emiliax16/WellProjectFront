import axios from 'axios';

const apiClient = axios.create({
    baseURL: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/`,
    headers: {
        'Content-Type': 'application/json',
    },
});


export default apiClient;
