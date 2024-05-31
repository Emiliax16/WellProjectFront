// Base url
const urlTypes = {
    productionUrl: `https://jpoezi.me/`,
    developmentUrl: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/`,
}

let baseUrl = process.env.NODE_ENV === 'development' ? urlTypes.developmentUrl : urlTypes.productionUrl

// Auth Request
const auth = {
    login: process.env.REACT_APP_API_ENDPOINT_AUTH_LOGIN,
    register: process.env.REACT_APP_API_ENDPOINT_AUTH_REGISTER,
}
// User Request
const userBack = {
    postUser: process.env.REACT_APP_API_ENDPOINT_POST_USER,
}

// Contact Landing Page Request
const contactBack = {
    postContact: process.env.REACT_APP_API_ENDPOINT_POST_CONTACT,
}

// Client Request
const clientBack = {
    getClients: process.env.REACT_APP_API_ENDPOINT_CLIENT_PREFIX, 
    getDetails: process.env.REACT_APP_API_ENDPOINT_GET_USER_INFO,
    putClient: process.env.REACT_APP_API_ENDPOINT_CLIENT_PREFIX,
    deleteClient: process.env.REACT_APP_API_ENDPOINT_CLIENT_PREFIX,
}

const clientFront = {
    urlClients: process.env.REACT_APP_API_ENDPOINT_CLIENT_PREFIX,
}

// Wells request
const wellBack = {
    getWells: process.env.REACT_APP_API_ENDPOINT_GET_ALL_WELLS,
    putWell: process.env.REACT_APP_API_ENDPOINT_PUT_WELL,
    postWell: process.env.REACT_APP_API_ENDPOINT_POST_WELL,
    deleteWell: process.env.REACT_APP_API_ENDPOINT_DELETE_WELL,

}

module.exports = {
    clientFront,
    clientBack,
    wellBack,
    userBack,
    baseUrl,
    auth,
    contactBack,
}
