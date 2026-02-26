'use strict';

const qs = require('qs');
const axios = require('axios');
const accessToken = 'EUAYMrukI38WaIYkzyNAZ1tvlUFj3lac9UQOjD35aZt';

module.exports = {
  notify: async (ctx, next) => {
    try {

      const requestOption = {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ` + accessToken
        },
        data: qs.stringify({ message: qs.parse(ctx.request.body).message }),
        url: 'https://notify-api.line.me/api/notify'
      };

      return axios(requestOption).then(axiosRes => {
        if (axiosRes.status === 200) {
          return { status: 'ok' };
        }
      });
    } catch (err) {
      ctx.body = err;
    }
  }
};
