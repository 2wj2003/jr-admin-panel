module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/setup/permissions',
      handler: 'setup.enablePermissions',
      config: {
        auth: false,
      },
    },
  ],
};
