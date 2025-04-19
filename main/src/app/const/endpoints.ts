
export let endpoints = {
  article:{
    create: '/backoffice/article',
    update: '/backoffice/article',
    list: '/backoffice/article',
    get: '/backoffice/article',
  },
  user: {
    activateUser: '/backoffice/users/$idUser/activate',
    disactivateUser: '/backoffice/users/$idUser/disactivate',
    getTemporaryToken: '/backoffice/users/temporaryToken',
    resendActivation: "/backoffice/users/resend-activation",
  },
};
