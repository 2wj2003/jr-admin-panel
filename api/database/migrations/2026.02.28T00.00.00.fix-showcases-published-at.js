'use strict';

/**
 * Migration: Fix showcases published_at column
 *
 * Strapi tries to DELETE drafts (published_at IS NULL) when draftAndPublish is false,
 * but the column may not exist in production. This migration adds it temporarily
 * and marks all rows as published so Strapi's cleanup succeeds without errors.
 */

async function up(knex) {
  const hasColumn = await knex.schema.hasColumn('showcases', 'published_at');
  if (!hasColumn) {
    await knex.schema.alterTable('showcases', (table) => {
      table.timestamp('published_at', { precision: 6 }).nullable();
    });
    // Mark all existing rows as published so the DELETE WHERE published_at IS NULL finds nothing
    await knex('showcases').update({ published_at: knex.fn.now() });
  }
}

async function down(knex) {
  // no-op: Strapi will drop the column itself after cleanup
}

module.exports = { up, down };
