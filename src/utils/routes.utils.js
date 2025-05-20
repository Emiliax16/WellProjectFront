// Base url
const urlTypes = {
    productionUrl: `https://promedicionbackend.com/`,
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
    userRole: process.env.REACT_APP_API_ENDPOINT_GET_USER_ROLE,
    allUsersRoles: process.env.REACT_APP_API_ENDPOINT_GET_ALL_USERS_ROLES,
}

// Contact Landing Page Request
const contactBack = {
    postContact: process.env.REACT_APP_API_ENDPOINT_POST_CONTACT,
}

// Company Request
const companyBack = {
    getCompanies: process.env.REACT_APP_API_ENDPOINT_GET_ALL_COMPANIES,
    getCompanyDetails: process.env.REACT_APP_API_ENDPOINT_GET_ONE_COMPANY,
    putCompany: process.env.REACT_APP_API_ENDPOINT_PUT_COMPANY,
    deleteCompany: process.env.REACT_APP_API_ENDPOINT_DELETE_COMPANY,
}

// Distributor request
const distributorBack = {
    getDistributors: process.env.REACT_APP_API_ENDPOINT_GET_ALL_DISTRIBUTORS,
    getDistributorDetails: process.env.REACT_APP_API_ENDPOINT_GET_ONE_DISTRIBUTOR,
    putDistributor: process.env.REACT_APP_API_ENDPOINT_PUT_DISTRIBUTOR,
    deleteDistributor: process.env.REACT_APP_API_ENDPOINT_DELETE_DISTRIBUTOR,
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

const companyFront = {
    urlCompanies: process.env.REACT_APP_API_ENDPOINT_COMPANY_PREFIX,
}

const distributorFront = {
    urlDistributor: process.env.REACT_APP_API_ENDPOINT_GET_ALL_DISTRIBUTORS
}

// Wells request
const wellBack = {
    getWells: process.env.REACT_APP_API_ENDPOINT_GET_ALL_WELLS,
    putWell: process.env.REACT_APP_API_ENDPOINT_PUT_WELL,
    postWell: process.env.REACT_APP_API_ENDPOINT_POST_WELL,
    deleteWell: process.env.REACT_APP_API_ENDPOINT_DELETE_WELL,
    statusWell: process.env.REACT_APP_API_ENDPOINT_PUT_WELL,
}

// WellData request
const wellDataBack = {
    getWellData: process.env.REACT_APP_API_ENDPOINT_WELL_DATA_PREFIX,
    sendWellData: process.env.REACT_APP_API_ENDPOINT_SEND_DATA,
}

module.exports = {
    clientFront,
    clientBack,
    wellBack,
    userBack,
    baseUrl,
    auth,
    contactBack,
    companyBack,
    companyFront,
    wellDataBack,
    distributorBack,
<<<<<<< HEAD
=======
    distributorFront,
>>>>>>> 75af84f2f32aa9596caf510a245708e3b5f14d56
}
