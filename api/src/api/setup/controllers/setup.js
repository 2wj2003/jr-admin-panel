'use strict';

module.exports = {
  async debug(ctx) {
    try {
      // Check if content type is registered
      const contentTypes = Object.keys(strapi.contentTypes).filter(k => k.includes('featured'));
      
      // Check if API routes are registered
      const apis = Object.keys(strapi.api || {});
      
      // Try to query the collection
      let queryResult = null;
      let queryError = null;
      try {
        queryResult = await strapi.entityService.findMany('api::featured-category.featured-category', {
          limit: 1,
        });
      } catch (e) {
        queryError = e.message;
      }

      // Check permissions
      let permissions = [];
      try {
        permissions = await strapi
          .query('plugin::users-permissions.permission')
          .findMany({ where: { action: { $contains: 'featured-category' } } });
      } catch (e) {
        permissions = [{ error: e.message }];
      }

      return ctx.send({
        contentTypes,
        apis,
        queryResult,
        queryError,
        permissions: permissions.map(p => ({ id: p.id, action: p.action, enabled: p.enabled })),
      });
    } catch (error) {
      return ctx.send({ error: error.message });
    }
  },

  async enablePermissions(ctx) {
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) {
        return ctx.send({ success: false, message: 'Public role not found' });
      }

      const permissionsToEnable = [
        'api::featured-category.featured-category.find',
        'api::featured-category.featured-category.findOne',
        'api::featured-category.featured-category.create',
        'api::featured-category.featured-category.update',
        'api::featured-category.featured-category.delete',
        'api::chat-message.chat-message.find',
        'api::chat-message.chat-message.findOne',
        'api::chat-message.chat-message.update',
        'api::contact-form.contact-form.find',
        'api::contact-form.contact-form.findOne',
        'api::chat-session.chat-session.find',
        'api::chat-session.chat-session.findOne',
      ];

      const results = [];

      for (const action of permissionsToEnable) {
        try {
          const permission = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({ where: { action, role: publicRole.id } });

          if (!permission) {
            await strapi
              .query('plugin::users-permissions.permission')
              .create({ data: { action, role: publicRole.id, enabled: true } });
            results.push({ action, status: 'created_and_enabled' });
          } else if (!permission.enabled) {
            await strapi
              .query('plugin::users-permissions.permission')
              .update({ where: { id: permission.id }, data: { enabled: true } });
            results.push({ action, status: 'enabled' });
          } else {
            results.push({ action, status: 'already_enabled' });
          }
        } catch (error) {
          results.push({ action, status: 'error', message: error.message });
        }
      }

      return ctx.send({
        success: true,
        message: 'Permissions updated',
        results,
      });
    } catch (error) {
      return ctx.send({
        success: false,
        message: error.message,
      });
    }
  },
};
