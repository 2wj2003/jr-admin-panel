module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/line-notify',
     handler: 'line-notify.notify',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
