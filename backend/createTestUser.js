const pool = require('./src/db');
const bcrypt = require('bcrypt');

async function createTestUser() {
  try {
    console.log('Connecting to database...');
    
    // Test connection first
    const test = await pool.query('SELECT NOW()');
    console.log('✅ Database connected\n');
    
    const email = 'admin@test.com';
    const password = 'admin123';
    
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed\n');
    
    console.log('Checking if table exists...');
    const tableCheck = await pool.query(`
      SELECT EXISTS(
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'staff'
      )
    `);
    console.log('Table exists:', tableCheck.rows[0].exists ? '✅ Yes' : '❌ No\n');
    
    console.log('Inserting user...');
    const query = `
      INSERT INTO staff (name, email, password, role, department)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET password = $3
      RETURNING id, name, email, role
    `;
    
    const result = await pool.query(query, [
      'Admin User',
      email,
      hashedPassword,
      'admin',
      'Admin'
    ]);
    
    console.log('✅ User created!\n');
    console.log('='.repeat(40));
    console.log('LOGIN CREDENTIALS:');
    console.log('='.repeat(40));
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('='.repeat(40));
    
    console.log('\n1. Open: http://localhost:3000');
    console.log('2. Enter email and password above');
    console.log('3. Click Login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:');
    console.error('Full error object:', JSON.stringify(error, null, 2));
    console.error('\nTroubleshooting:');
    console.error('1. Is PostgreSQL running?');
    console.error('2. Does database "od_system" exist?');
    console.error('3. Does table "staff" exist? (run: npm run db:init)');
    console.error('4. Check backend/.env has DATABASE_URL set\n');
    process.exit(1);
  }
}

createTestUser();
