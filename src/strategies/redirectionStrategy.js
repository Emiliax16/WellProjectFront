const redirectionStrategies = {
    admin: () => '/admin',
    user: (clientId) => `/clients/${clientId}`,
  };
  
  export const getRedirectionPath = (isAdmin, user) => {
    const role = isAdmin ? 'admin' : 'user';
    const { id: clientId } = isAdmin ? {} : user.client;
    return redirectionStrategies[role] ? redirectionStrategies[role](clientId) : '/login';
  };
  