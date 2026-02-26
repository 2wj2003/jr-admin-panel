'use strict';

/**
 * contact-form controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact-form.contact-form', ({ strapi }) => ({
  async create(ctx) {
    // Get IP address and user agent
    const ipAddress = ctx.request.ip || ctx.request.headers['x-forwarded-for'] || ctx.request.socket.remoteAddress;
    const userAgent = ctx.request.headers['user-agent'];

    // Add IP and user agent to request body
    ctx.request.body.data = {
      ...ctx.request.body.data,
      ipAddress,
      userAgent,
      status: 'pending'
    };

    // Create the contact form entry
    const response = await super.create(ctx);

    // TODO: Send email notification to admin
    // You can implement email sending here using Strapi's email plugin

    return response;
  }
}));
