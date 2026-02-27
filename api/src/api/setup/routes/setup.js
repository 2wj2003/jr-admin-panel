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
    {
      method: 'GET',
      path: '/setup/debug',
      handler: 'setup.debug',
      config: {
        auth: false,
      },
    },
  ],
};
