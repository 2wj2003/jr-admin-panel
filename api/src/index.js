'use strict';

module.exports = {
  async bootstrap({ strapi }) {
    try {
      // Get the public role
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) {
        console.log('[permissions] Public role not found');
        return;
      }

      // Actions to enable for public role
      const actionsToEnable = [
        'api::chat-message.chat-message.find',
        'api::chat-message.chat-message.findOne',
        'api::chat-message.chat-message.create',
        'api::chat-message.chat-message.update',
        'api::chat-session.chat-session.find',
        'api::chat-session.chat-session.findOne',
        'api::chat-session.chat-session.create',
        'api::chat-session.chat-session.update',
        'api::contact-form.contact-form.find',
        'api::contact-form.contact-form.findOne',
        'api::contact-form.contact-form.create',
        'api::featured-category.featured-category.find',
        'api::featured-category.featured-category.findOne',
        'api::featured-category.featured-category.create',
        'api::featured-category.featured-category.update',
        'api::featured-category.featured-category.delete',
      ];

      let changed = 0;
      for (const action of actionsToEnable) {
        const existing = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action, role: publicRole.id } });

        if (!existing) {
          await strapi
            .query('plugin::users-permissions.permission')
            .create({ data: { action, role: publicRole.id } });
          changed++;
          console.log('[permissions] Created: ' + action);
        }
      }

      if (changed > 0) {
        console.log('[permissions] Created ' + changed + ' new permissions, will take effect on this startup');
      } else {
        console.log('[permissions] All permissions already exist');
      }
    } catch (error) {
      console.error('[permissions] Error:', error.message);
    }
  }
};
