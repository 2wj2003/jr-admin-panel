'use strict';

module.exports = {
  async bootstrap({ strapi }) {
    // Use the Users & Permissions plugin service to properly update role permissions
    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });

    // Get public role
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({
        where: { type: 'public' },
        populate: ['permissions'],
      });

    if (!publicRole) {
      console.log('⚠️ Public role not found');
      return;
    }

    console.log(`📋 Public role ID: ${publicRole.id}, current permissions: ${publicRole.permissions?.length || 0}`);

    // Define which actions to enable for public role
    const actionsToEnable = [
      // Featured Categories - full CRUD
      'api::featured-category.featured-category.find',
      'api::featured-category.featured-category.findOne',
      'api::featured-category.featured-category.create',
      'api::featured-category.featured-category.update',
      'api::featured-category.featured-category.delete',
      // Chat Messages - read and update
      'api::chat-message.chat-message.find',
      'api::chat-message.chat-message.findOne',
      'api::chat-message.chat-message.update',
      'api::chat-message.chat-message.create',
      // Contact Forms - read and create
      'api::contact-form.contact-form.find',
      'api::contact-form.contact-form.findOne',
      'api::contact-form.contact-form.create',
      // Chat Sessions - read and create/update
      'api::chat-session.chat-session.find',
      'api::chat-session.chat-session.findOne',
      'api::chat-session.chat-session.create',
      'api::chat-session.chat-session.update',
      // Setup - public access
      'api::setup.setup.enablePermissions',
      'api::setup.setup.debug',
    ];

    // Build the permissions object that Strapi's updateRole expects
    // Get existing permissions first
    const existingPermissions = publicRole.permissions || [];
    const existingActions = new Set(existingPermissions.map(p => p.action));

    let created = 0;
    for (const action of actionsToEnable) {
      if (!existingActions.has(action)) {
        try {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action,
              role: publicRole.id,
            },
          });
          console.log(`🆕 Created permission: ${action}`);
          created++;
        } catch (error) {
          console.error(`❌ Error creating permission ${action}:`, error.message);
        }
      } else {
        console.log(`⏭️ Already exists: ${action}`);
      }
    }

    // Force Strapi to reload permissions by updating the role
    if (created > 0) {
      try {
        await strapi.plugin('users-permissions').service('users-permissions').initialize();
        console.log('🔄 Reloaded users-permissions plugin');
      } catch (error) {
        console.log('⚠️ Could not reload plugin, permissions will apply after restart');
      }
    }

    console.log(`🎉 Public permissions setup completed (${created} new permissions created)`);
  }
};
