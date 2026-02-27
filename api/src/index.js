'use strict';

module.exports = {
  async bootstrap({ strapi }) {
    // Auto-enable public permissions for specific collections
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) {
      console.log('⚠️ Public role not found');
      return;
    }

    const permissionsToEnable = [
      // Featured Categories - full CRUD
      { action: 'api::featured-category.featured-category.find' },
      { action: 'api::featured-category.featured-category.findOne' },
      { action: 'api::featured-category.featured-category.create' },
      { action: 'api::featured-category.featured-category.update' },
      { action: 'api::featured-category.featured-category.delete' },
      // Chat Messages - read and update
      { action: 'api::chat-message.chat-message.find' },
      { action: 'api::chat-message.chat-message.findOne' },
      { action: 'api::chat-message.chat-message.update' },
      // Contact Forms - read only
      { action: 'api::contact-form.contact-form.find' },
      { action: 'api::contact-form.contact-form.findOne' },
      // Chat Sessions - read only
      { action: 'api::chat-session.chat-session.find' },
      { action: 'api::chat-session.chat-session.findOne' },
    ];

    for (const { action } of permissionsToEnable) {
      try {
        const permission = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action, role: publicRole.id } });

        if (permission && !permission.enabled) {
          await strapi
            .query('plugin::users-permissions.permission')
            .update({ where: { id: permission.id }, data: { enabled: true } });
          console.log(`✅ Enabled permission: ${action}`);
        }
      } catch (error) {
        console.error(`❌ Error enabling permission ${action}:`, error.message);
      }
    }

    console.log('🎉 Public permissions setup completed');
  }
};
