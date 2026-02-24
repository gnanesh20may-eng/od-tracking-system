# 🎯 Login with Your Personal Account

Your team wants to login with their personal IDs, not test accounts. Here's how to set it up.

---

## 🚀 Quick Start - 2 Ways

### Option A: Interactive Script (EASIEST)

**PowerShell Users:**
```powershell
.\register_user.ps1
```

**Command Prompt Users:**
```cmd
register_user.bat
```

This will:
1. Ask for your details
2. Create your account
3. Show your login credentials

---

### Option B: Manual API Call

Use curl or Postman to create accounts:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your.email@college.com",
    "password": "YourPassword123",
    "role": "staff",
    "department": "Your Department"
  }'
```

---

## 📋 Step-by-Step

### Step 1: Ensure Backend is Running
```bash
cd backend
npm run dev
```
Should show: ✓ Server running on port 5000

### Step 2: Create Account (Choose One)

**Using Interactive Script:**
```powershell
.\register_user.ps1    # PowerShell
# Or
register_user.bat      # Command Prompt
```

**Using API:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your.email@college.com",
    "password": "your_password",
    "role": "staff",
    "department": "Your Department"
  }'
```

### Step 3: Login
1. Open: http://localhost:3000
2. Email: Your email from above
3. Password: Your password from above
4. Click Login

---

## 👥 Create Multiple Accounts

### For Multiple Team Members

**Using PowerShell Script (Repeat for each person):**
```powershell
.\register_user.ps1
# Enters interactive mode
# Creates account
# Repeat for next person
```

**Using Batch Script (Repeat for each person):**
```cmd
register_user.bat
# Enters interactive mode
# Creates account
# Repeat for next person
```

**Using API (Repeat for each person):**
```bash
# Create person 1
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Person 1",
    "email": "person1@college.com",
    "password": "Password1",
    "role": "staff",
    "department": "CS"
  }'

# Create person 2
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Person 2",
    "email": "person2@college.com",
    "password": "Password2",
    "role": "staff",
    "department": "CS"
  }'
```

---

## 🔑 User Roles

Choose the right role when creating accounts:

### Staff (staff)
- Can track location during duty
- Can view own location history
- Cannot create duties

**Use for:** Employees, students, staff members

### HOD (hod)
- Can create duties
- Can view all staff location history
- Can access dashboard
- Can see statistics

**Use for:** Department heads, supervisors

### Admin (admin)
- Full system access
- Can create users
- Can manage everything

**Use for:** System administrators, IT staff

---

## ✅ Verify Account Created

After creating an account, verify it exists:

```bash
# Connect to database
psql -U postgres -d od_system

# List all users
SELECT id, name, email, role FROM staff;

# Check specific user
SELECT * FROM staff WHERE email = 'your.email@college.com';

# Exit
\q
```

---

## 🔒 Password Requirements

- Minimum 6 characters
- Recommended: 8+ characters
- Mix of uppercase and lowercase
- Include numbers
- Example: `SecurePass@2025`

---

## 📝 Example: Creating Team Accounts

**Person 1: Staff Member**
```
Name: Ramesh Kumar
Email: ramesh@college.com
Password: Secure@Pass123
Role: staff
Department: Computer Science
```

**Person 2: Department HOD**
```
Name: Dr. Sharma
Email: sharma@college.com
Password: HODPass@2025
Role: hod
Department: Computer Science
```

**Person 3: System Admin**
```
Name: IT Admin
Email: admin@college.com
Password: AdminSecure@123
Role: admin
Department: Administration
```

---

## Using Interactive Script

### PowerShell Version:

```powershell
.\register_user.ps1
```

You'll see:
```
╔════════════════════════════════════════════════════════╗
║         Create Your Personal User Account              ║
╚════════════════════════════════════════════════════════╝

Checking if backend is running...
✅ Backend is running on port 5000

Please enter your details:

1. Full Name (e.g., Ramesh Kumar): Ramesh Kumar
2. Email (e.g., ramesh@college.com): ramesh@college.com
3. Password (at least 6 characters): MyPassword123

4. Select Role:
   [1] staff    - Staff Member (default)
   [2] hod      - Head of Department
   [3] admin    - Administrator

Enter choice (1-3, default is 1): 1
5. Department (e.g., Computer Science): Computer Science

╔════════════════════════════════════════════════════════╗
║                  Review Your Details                   ║
╚════════════════════════════════════════════════════════╝

Name:       Ramesh Kumar
Email:      ramesh@college.com
Password:   (hidden)
Role:       staff
Department: Computer Science

Is this correct? (y/n): y

📝 Creating account...

✅ Account created successfully!

╔════════════════════════════════════════════════════════╗
║                  LOGIN CREDENTIALS                     ║
╚════════════════════════════════════════════════════════╝

Email:    ramesh@college.com
Password: MyPassword123
```

---

## API Response

When account is created successfully:

```json
{
  "message": "Staff registered successfully",
  "staff": {
    "id": 1,
    "name": "Your Name",
    "email": "your.email@college.com",
    "role": "staff",
    "department": "Your Department"
  }
}
```

---

## Troubleshooting

### "Email already registered"
- Email is already in use
- Use a different email address
- Or delete existing account from database

### "Backend is NOT running"
- Start backend: `cd backend && npm run dev`
- Wait 5 seconds for it to start
- Then try script again

### "Invalid role"
- Use only: staff, hod, or admin
- Check spelling

### "Missing required fields"
- Provide all fields:
  - Name
  - Email
  - Password
  - Role
  - Department (optional but recommended)

### Password not working after creation
- Make sure you copied it correctly
- Check for extra spaces
- Try creating new account with different password

---

## Complete Workflow

```
1. Start Backend
   └─ cd backend && npm run dev

2. Create Accounts (One or more times)
   └─ .\register_user.ps1 (or .bat)
   └─ Follow prompts
   └─ Account created

3. Start Frontend (in new terminal)
   └─ cd frontend && npm start

4. Login in Browser
   └─ Open http://localhost:3000
   └─ Enter email and password
   └─ Click Login
   └─ See dashboard

5. Use the System
   └─ Staff: View history, track location
   └─ HOD: Create duties, monitor staff
   └─ Admin: Full access
```

---

## Files Created for You

| File | Purpose |
|------|---------|
| `register_user.ps1` | Interactive registration (PowerShell) |
| `register_user.bat` | Interactive registration (Command Prompt) |
| `CREATE_PERSONAL_ACCOUNT.md` | Detailed account creation guide |

---

## Quick Commands Cheat Sheet

```bash
# Create account (PowerShell)
.\register_user.ps1

# Create account (Command Prompt)
register_user.bat

# Create account (API - replace with your details)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Name","email":"email@college.com","password":"Pass123","role":"staff","department":"CS"}'

# Verify account
psql -U postgres -d od_system -c "SELECT email, role FROM staff;"

# Login
# Open http://localhost:3000
# Enter email and password
```

---

## Security Reminders

✅ **DO:**
- Use strong, unique passwords
- Keep passwords confidential
- Create one account per person

⚠️ **DON'T:**
- Share passwords
- Use simple passwords (like "password")
- Reuse passwords across systems

---

## Support

For detailed help, see:
- `CREATE_PERSONAL_ACCOUNT.md` - Account creation details
- `TROUBLESHOOTING_LOGIN.md` - Fix login issues
- `README.md` - System documentation

---

## Next Steps

1. ✅ Start backend: `cd backend && npm run dev`
2. ✅ Create your account: `.\register_user.ps1` (or .bat)
3. ✅ Start frontend: `cd frontend && npm start`
4. ✅ Login at: http://localhost:3000
5. ✅ Use the system!

---

**Ready to create your account?** 🎯

Run: `.\register_user.ps1` (PowerShell) or `register_user.bat` (Command Prompt)

Good luck! 🚀
