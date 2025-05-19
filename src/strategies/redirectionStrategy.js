const redirectionStrategies = {
  admin: () => '/admin',
  user: (clientId) => `/clients/${clientId}`,
  company: (companyId) => `/companies/${companyId}`,
  distributor: (distributorId) => `/distributors/${distributorId}`,
};

export const getRedirectionPath = (isAdmin, isCompany, isDistributor, user) => {
  let role = '';
  
  if (isAdmin) {
    role = 'admin';
  } else if (isCompany) {
    role = 'company';
  } else if (isDistributor) {
    role = 'distributor';
  } else {
    role = 'user';
  }

  console.log("OJO AL USER", user)
  const actualUserId = isAdmin
    ? null
    : isCompany
    ? user.company?.id
    : isDistributor
    ? user.distributor?.id
    : user.client?.id    
  
  if (!actualUserId && !isAdmin) {
    return '/login';
  }

  return redirectionStrategies[role] ? redirectionStrategies[role](actualUserId) : '/login';
};
