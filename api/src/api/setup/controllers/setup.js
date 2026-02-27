'use strict';

module.exports = {
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

          if (permission) {
            await strapi
              .query('plugin::users-permissions.permission')
              .update({ where: { id: permission.id }, data: { enabled: true } });
            results.push({ action, status: 'enabled' });
          } else {
            results.push({ action, status: 'not_found' });
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
