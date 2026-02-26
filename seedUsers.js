const pool = require('../src/db');
const { hashPassword } = require('../src/utils/auth');

/**
 * Seed Database with Test Users
 * Creates sample staff, hod, and admin users for testing
 */
async function seedUsers() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Seeding test users (including gokul@gmail.com)...\n');

    // Test credentials
    const testUsers = [
      {
        name: 'Gokul',
        email: 'gokul@gmail.com',
        password: 'gokul123',
        role: 'staff',
        department: 'Computer Science',
      },
      {
        name: 'Jane HOD',
        email: 'hod@college.com',
        password: 'password123',
        role: 'hod',
        department: 'Computer Science',
      },
      {
        name: 'Admin User',
        email: 'admin@college.com',
        password: 'password123',
        role: 'admin',
        department: 'Administration',
      },
    ];

    for (const user of testUsers) {
      try {
        // Check if user already exists
        const existingUser = await client.query(
          'SELECT id FROM staff WHERE email = $1',
          [user.email]
        );

        if (existingUser.rows.length === 0) {
          // Hash password
          const hashedPassword = await hashPassword(user.password);

          // Insert user
          const result = await client.query(
            'INSERT INTO staff (name, email, password, role, department) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [user.name, user.email, hashedPassword, user.role, user.department]
          );

          console.log(`✅ Created ${user.role.toUpperCase()}: ${user.email}`);
        } else {
          console.log(`⏭️  User already exists: ${user.email}`);
        }
      } catch (error) {
        console.error(`❌ Error creating user ${user.email}:`, error.message);
      }
    }

    console.log('\n📋 Test Users Created Successfully!\n');
    console.log('Use these credentials to login:\n');
    
    testUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    client.release();
  }
}

// Run seeding
seedUsers();
