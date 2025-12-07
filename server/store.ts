import knex from 'knex';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Configuration for DB connection
// If DATABASE_URL exists (Cloud/Supabase), use Postgres. Otherwise use local SQLite file.
const config = (isProduction || process.env.DATABASE_URL)
  ? {
    client: 'pg',
    connection: process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes('localhost') ? '' : '?sslmode=require'),
    searchPath: ['public', 'public'],
  }
  : {
    client: 'sqlite3',
    connection: {
      // Use process.cwd() to correctly locate the sqlite file relative to where the server is started
      filename: path.resolve((process as any).cwd(), 'database.sqlite'),
    },
    useNullAsDefault: true,
  };

export const db = knex(config);

// Initialize Database Schema
export const initDb = async () => {
  try {
    // Users Table
    const hasUsers = await db.schema.hasTable('users');
    if (!hasUsers) {
      await db.schema.createTable('users', (table) => {
        table.string('id').primary();
        table.string('email').unique().notNullable();
        table.string('password'); // Nullable for social login users
        table.string('name');
        table.string('plan').defaultTo('Free');
        table.string('role').defaultTo('user');
        table.boolean('activated').defaultTo(false);
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log('Created users table');
    }

    // Projects Table
    const hasProjects = await db.schema.hasTable('projects');
    if (!hasProjects) {
      await db.schema.createTable('projects', (table) => {
        table.string('id').primary();
        table.string('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('name');
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log('Created projects table');
    }

    // Assets Table
    const hasAssets = await db.schema.hasTable('assets');
    if (!hasAssets) {
      await db.schema.createTable('assets', (table) => {
        table.string('id').primary();
        table.string('project_id').references('id').inTable('projects').onDelete('CASCADE');
        table.string('type');
        table.string('name');
        table.text('data'); // JSON string
        table.string('source_file_name');
        table.string('source_file_type');
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log('Created assets table');
    }

    console.log(`Database initialized (${(isProduction || process.env.DATABASE_URL) ? 'PostgreSQL' : 'SQLite'})`);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};