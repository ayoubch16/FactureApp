
export let endpoints = {
  article:{
    create: `/api/articles`,
    update:(id:number)=>`/api/articles/${id}`,
    delete:(id:number)=>`/api/articles/${id}`,
    getOne:(id:number)=>`/api/articles/${id}`,
    list:`http://localhost:8080/api/articles`,
  },
  user: {
    activateUser: '/backoffice/users/$idUser/activate',
    disactivateUser: '/backoffice/users/$idUser/disactivate',
    getTemporaryToken: '/backoffice/users/temporaryToken',
    resendActivation: "/backoffice/users/resend-activation",
  },
};
