const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@jr.co.th';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';

async function setPermissions() {
  try {
    console.log('🔐 Logging in to Strapi...');
    
    // Login as admin
    const loginResponse = await axios.post(`${STRAPI_URL}/admin/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Logged in successfully');

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Get public role
    console.log('📋 Fetching public role...');
    const rolesResponse = await axios.get(
      `${STRAPI_URL}/admin/users-permissions/roles`,
      { headers }
    );

    const publicRole = rolesResponse.data.roles.find(r => r.type === 'public');
    if (!publicRole) {
      console.error('❌ Public role not found');
      return;
    }

    console.log(`✅ Found public role (ID: ${publicRole.id})`);

    // Define permissions to enable
    const permissionsToEnable = {
      'featured-category': ['find', 'findOne', 'create', 'update', 'delete'],
      'chat-message': ['find', 'findOne', 'update'],
      'contact-form': ['find', 'findOne'],
      'chat-session': ['find', 'findOne'],
    };

    // Update permissions
    console.log('🔧 Updating permissions...');

    const updatedPermissions = { ...publicRole.permissions };

    Object.entries(permissionsToEnable).forEach(([controller, actions]) => {
      if (!updatedPermissions[controller]) {
        updatedPermissions[controller] = { controllers: {} };
      }
      if (!updatedPermissions[controller].controllers) {
        updatedPermissions[controller].controllers = {};
      }
      if (!updatedPermissions[controller].controllers[controller]) {
        updatedPermissions[controller].controllers[controller] = {};
      }

      actions.forEach(action => {
        updatedPermissions[controller].controllers[controller][action] = {
          enabled: true,
          policy: '',
        };
      });
    });

    await axios.put(
      `${STRAPI_URL}/admin/users-permissions/roles/${publicRole.id}`,
      {
        ...publicRole,
        permissions: updatedPermissions,
      },
      { headers }
    );

    console.log('✅ Permissions updated successfully!');
    console.log('\n📋 Enabled permissions:');
    Object.entries(permissionsToEnable).forEach(([controller, actions]) => {
      console.log(`  - ${controller}: ${actions.join(', ')}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

setPermissions();
