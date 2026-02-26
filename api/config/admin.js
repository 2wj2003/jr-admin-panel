module.exports = ({ env }) => ({
  watchIgnoreFiles: ['**/config/sync/**'],
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'tobemodified-admin-jwt-secret-key')
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'tobemodified-api-token-salt-key')
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'tobemodified-transfer-token-salt'),
    },
  },
});
