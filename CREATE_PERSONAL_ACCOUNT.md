# Create Personal User Account

You can create your own personal user account in two ways:

## Option 1: Using API (Recommended)

### Prerequisites
- Backend running: `npm run dev` (in backend folder)

### Register a New User

**Using cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Full Name",
    "email": "your.email@college.com",
    "password": "your_password_123",
    "role": "staff",
    "department": "Computer Science"
  }'
```

**Using Postman:**
1. Create new POST request
2. URL: `http://localhost:5000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (JSON):
```json
{
  "name": "Your Full Name",
  "email": "your.email@college.com",
  "password": "your_secure_password",
  "role": "staff",
  "department": "Computer Science"
}
```

**Using JavaScript (in browser console):**
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Your Full Name',
    email: 'your.email@college.com',
    password: 'your_password_123',
    role: 'staff',
    department: 'Computer Science'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## User Roles Explained

Choose the appropriate role:

### 1. **staff** (Staff Member)
- Can track location during duty
- Can view their own location history
- Cannot create duties
- Cannot manage other users

**Use when:** Creating account for a staff member

### 2. **hod** (Head of Department)
- Can create duties for staff
- Can view all staff location history
- Can access dashboard
- Can see compliance statistics

**Use when:** Creating account for department head

### 3. **admin** (Administrator)
- Full system access
- Can create users
- Can manage duties
- Can access all reports

**Use when:** Creating account for system administrator

---

## Example: Creating Multiple Users

### User 1: Staff Member
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ramesh Kumar",
    "email": "ramesh@college.com",
    "password": "secure_password_123",
    "role": "staff",
    "department": "Computer Science"
  }'
```

Response:
```json
{
  "message": "Staff registered successfully",
  "staff": {
    "id": 1,
    "name": "Ramesh Kumar",
    "email": "ramesh@college.com",
    "role": "staff",
    "department": "Computer Science"
  }
}
```

### User 2: HOD
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sharma",
    "email": "sharma@college.com",
    "password": "hod_password_123",
    "role": "hod",
    "department": "Computer Science"
  }'
```

### User 3: Admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@college.com",
    "password": "admin_password_123",
    "role": "admin",
    "department": "Administration"
  }'
```

---

## Success Response

When user is created successfully, you'll get:

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

## Then Login

After creating your account, login with:
1. Open: `http://localhost:3000`
2. Email: `your.email@college.com`
3. Password: Your chosen password
4. Click Login

---

## Option 2: Database Direct Insert (Advanced)

If you prefer database access:

```bash
# Connect to PostgreSQL
psql -U postgres -d od_system

# Insert a new user (password must be bcrypted)
# Use the register API above instead - easier!
```

**Recommendation:** Use Option 1 (API) - it handles password hashing automatically.

---

## Fields Explanation

| Field | Description | Example |
|-------|-------------|---------|
| name | Full name | "Ramesh Kumar" |
| email | Email address | "ramesh@college.com" |
| password | Strong password | "MySecure@Pass123" |
| role | User role (staff/hod/admin) | "staff" |
| department | Department name | "Computer Science" |

---

## Validation Rules

- **Name:** Required, min 2 characters
- **Email:** Required, must be valid email format
- **Password:** Required, min 6 characters (recommended: 8+ with mix of letters/numbers)
- **Role:** Must be one of: staff, hod, admin
- **Department:** Optional, any text

---

## Error Responses

### If email already exists:
```json
{
  "error": "Email already registered"
}
```
**Solution:** Use a different email address

### If fields missing:
```json
{
  "error": "Missing required fields"
}
```
**Solution:** Provide all required fields: name, email, password, role

### If invalid role:
```json
{
  "error": "Invalid role"
}
```
**Solution:** Use role: staff, hod, or admin

---

## Security Tips

🔒 **Strong Password:**
- At least 8 characters
- Mix of uppercase and lowercase
- Include numbers and special characters
- Example: `SecurePass@2025`

⚠️ **Do NOT:**
- Share your password
- Use simple passwords like "password123"
- Reuse passwords across systems

✅ **DO:**
- Use unique, strong passwords
- Remember your password
- Keep email address unique

---

## Testing New Account

After creating account:

1. **Login Test:**
   - Go to: http://localhost:3000
   - Enter your email and password
   - Click Login
   - Should see dashboard

2. **Check Database:**
   ```bash
   psql -U postgres -d od_system
   SELECT email, role FROM staff;
   # Should show your new user
   ```

---

## Bulk Create Users

To create multiple users at once, create a script:

**create_users.sh (Linux/Mac):**
```bash
#!/bin/bash

# Array of users
declare -a users=(
  "name@email,password,staff,department"
  "name2@email,password2,hod,department2"
)

for user in "${users[@]}"; do
  IFS=',' read -r name email password role dept <<< "$user"
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$name\",\"email\":\"$email\",\"password\":\"$password\",\"role\":\"$role\",\"department\":\"$dept\"}"
  echo "Created: $email"
done
```

**create_users.ps1 (Windows PowerShell):**
```powershell
$users = @(
  @{name="John Staff"; email="john@college.com"; password="secure123"; role="staff"; dept="CS"},
  @{name="Jane HOD"; email="jane@college.com"; password="secure123"; role="hod"; dept="CS"}
)

foreach ($user in $users) {
  $body = @{
    name = $user.name
    email = $user.email
    password = $user.password
    role = $user.role
    department = $user.dept
  } | ConvertTo-Json

  Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body

  Write-Host "Created: $($user.email)"
}
```

---

## Verify Account Created

Check PostgreSQL directly:

```bash
psql -U postgres -d od_system

# List all users
SELECT id, name, email, role, department FROM staff;

# Check specific user
SELECT * FROM staff WHERE email = 'your.email@college.com';

# Exit
\q
```

---

## Now Login

1. **Stop any existing login attempts** - Close browser tab if still on login
2. **Clear browser cache** - Press Ctrl+Shift+Delete
3. **Open fresh:** http://localhost:3000
4. **Enter your credentials:**
   - Email: `your.email@college.com`
   - Password: `your_password_123`
5. **Click Login**

---

## Troubleshooting

### "Email already registered"
- Change email address
- Or verify your email doesn't already exist
- Check: `psql -c "SELECT email FROM staff WHERE email='test@college.com';"`

### "Invalid role"
- Use only: staff, hod, or admin
- Check spelling carefully

### "Missing required fields"
- Ensure all fields are provided
- Check JSON syntax is valid

### "Cannot reach backend"
- Ensure backend is running: `npm run dev`
- Port 5000 must be available

### Still can't login after registration
- Check password syntax (no special chars that need escaping)
- Verify account exists: `SELECT email FROM staff;`
- Try creating account again with different password

---

## Quick Create Command

**Replace with your details and copy-paste:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "YOUR_FULL_NAME",
    "email": "YOUR_EMAIL@college.com",
    "password": "YOUR_PASSWORD",
    "role": "staff",
    "department": "YOUR_DEPARTMENT"
  }'
```

Example to copy exactly:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj Kumar",
    "email": "raj@college.com",
    "password": "MyPassword@123",
    "role": "staff",
    "department": "Computer Science"
  }'
```

---

## Next Steps

1. ✅ Create your user account (use API above)
2. ✅ Verify account in database
3. ✅ Login with your email and password
4. ✅ See dashboard
5. ✅ Use the system

---

**Questions?**
- Need different role? Use role: hod or admin
- Want multiple accounts? Repeat for each person
- Having issues? Check troubleshooting section above

**Ready?** Create your account and login! 🚀
