require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function setup() {
  try {
    console.log('🔧 Setting up database...');

    // Create organizations table
    await sql`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Organizations table created');

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(organization_id, email)
      )
    `;
    console.log('✅ Users table created');

    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        price DECIMAL(10,2),
        stock INTEGER DEFAULT 0,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Products table created');

    // Create customers table
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Customers table created');

    // Create sales table
    await sql`
      CREATE TABLE IF NOT EXISTS sales (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
        total_amount DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Sales table created');

    // Insert organization
    await sql`
      INSERT INTO organizations (id, name, slug)
      VALUES (gen_random_uuid(), 'Acme Corporation', 'acme-corp')
      ON CONFLICT (slug) DO NOTHING
    `;
    console.log('✅ Organization inserted');

    // Insert admin user
    const org = await sql`SELECT id FROM organizations WHERE slug = 'acme-corp'`;
    if (org.length > 0) {
      await sql`
        INSERT INTO users (id, organization_id, name, email, password_hash, role, status)
        VALUES (gen_random_uuid(), ${org[0].id}, 'Admin User', 'admin@acme.com', 'hashed_password', 'admin', 'active')
        ON CONFLICT (organization_id, email) DO NOTHING
      `;
      console.log('✅ Admin user created');
    }

    console.log('🎉 Database setup complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setup();