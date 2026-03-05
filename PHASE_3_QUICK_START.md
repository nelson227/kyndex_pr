# 🚀 PHASE 3 QUICK START GUIDE

**Status: ✅ COMPLETE** - Authentication now uses secure backend API

---

## 🎯 What Changed

### Before (Phase 2)
```javascript
// ❌ Passwords stored in localStorage (UNSAFE!)
localStorage.setItem('kyndex_currentUser', {
  email: 'user@test.com',
  password: 'plaintext123'  // ⚠️ DANGEROUS!
});
```

### After (Phase 3)
```javascript
// ✅ Only tokens stored, passwords hashed on backend
localStorage.setItem('accessToken', 'eyJhbGc...');     // 15min expiry
localStorage.setItem('refreshToken', 'eyJhbGc...');   // 7day expiry
// Password never touched client-side!
```

---

## 🏃 Quick Test (5 minutes)

### Step 1: Verify servers are running
```bash
# Terminal 1 - Frontend
cd frontend && npm run dev
# Should show: "Local: http://localhost:3002"

# Terminal 2 - Backend  
cd backend && npm run dev
# Should show: "Found 0 errors. Watching for file changes."
```

### Step 2: Open frontend
- Go to: **http://localhost:3002**
- Click **"S'inscrire"** (Sign up button)

### Step 3: Test registration with Phase 3
Try this test user:
```
Prénom: John
Nom: Doe
Email: phase3test@kyndex.test
Téléphone: +33 6 12 34 56 78
Localisation: Paris
Mot de passe: Phase@Pass123  ⚠️ MUST include:
                             - 8+ characters
                             - 1 UPPERCASE (A-Z)
                             - 1 lowercase (a-z)
                             - 1 number (0-9)
                             - 1 symbol (@$!%*?&)
```

### Step 4: Verify tokens in browser
1. Open DevTools (F12)
2. Go to **Application** > **Local Storage** > http://localhost:3002
3. You should see:
   - ✅ `accessToken` - JWT token
   - ✅ `refreshToken` - JWT token for renewal
   - ✅ `kyndex_currentUser` - User JSON object
   - ❌ NO password stored!

### Step 5: Test login
1. Reload page (tokens should persist)
2. Try logging in with same credentials
3. Should redirect to `/dashboard`

---

## 📝 Files Modified

| File | What Changed | Why |
|------|-------------|-----|
| `frontend/src/app/page.tsx` | handleLogin/handleSignup now call API | Backend security |
| `backend/src/modules/auth/dto/register.dto.ts` | Added phone, location fields | Collect more user info |
| `backend/src/modules/auth/auth.service.ts` | register() accepts new fields | Pass to database |
| `backend/src/modules/auth/auth.controller.ts` | Pass new fields to service | Forward from API |
| `backend/src/modules/services/services.module.ts` | Removed dead imports | Fix compilation |

---

## 🔐 Security Checklist

- ✅ Passwords NOT in localStorage
- ✅ Backend validates email format
- ✅ Backend checks email uniqueness
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens have expiration
- ✅ Access token: 15 minutes
- ✅ Refresh token: 7 days
- ✅ Strong password required (A1@bcde+)
- ✅ Phone validation format
- ✅ Location minimum 2 chars

---

## 🐛 Troubleshooting

### Issue: "Port already in use"
**Solution:**
```bash
# Find process on port 3000
Get-NetTCPConnection -LocalPort 3000

# Kill it
Stop-Process -Id <PID> -Force

# OR use different port
npm run dev -- -p 3003
```

### Issue: "Backend not responding"
```bash
# Check if backend is running
curl http://localhost:3001/api/v1/auth/me

# Should get 401 (Unauthorized) - that's OK, means server works!
# If nothing: backend is down, run: cd backend && npm run dev
```

### Issue: "Strong password error"
Valid examples:
- ✅ `Test@Pass123`
- ✅ `MyApp@2026`
- ✅ `SecureP@ss1`

Invalid examples:
- ❌ `password123` (no symbols, no CAPS)
- ❌ `Test@123` (only 8 chars is minimum but needs mix)
- ❌ `ALLCAPS123@` (no lowercase)

### Issue: "Email already exists"
```bash
# This means the email is already registered
# Either:
1. Use different email for testing
2. Clear database: cd backend && npm run db:reset
3. Or login with existing email instead
```

---

## 💡 What Happens Behind the Scenes

### Signup Flow:
```
User fills form
    ↓
Frontend validates:
  - Email format
  - Phone format
  - Location length
  - Password strength
    ↓
Frontend calls: POST /api/v1/auth/register
    ↓
Backend receives:
  - email
  - password
  - firstName
  - lastName
  - phone (optional)
  - location (optional)
    ↓
Backend validates again (security!)
    ↓
Backend hashes password: bcrypt.hash(pwd, 10 rounds)
    ↓
Backend creates User + Profile in database
    ↓
Backend signs JWT tokens:
  - accessToken (15 min expiry)
  - refreshToken (7 day expiry)
    ↓
Backend returns: { accessToken, refreshToken, user }
    ↓
Frontend stores tokens in localStorage
    ↓
Frontend redirects to /dashboard
    ↓
Subsequent API calls auto-add: Authorization: Bearer <token>
    ↓
If token expired: auto-refresh using refreshToken
```

### Login Flow:
```
Much simpler:
User enters: email + password
    ↓
Frontend calls: POST /api/v1/auth/login
    ↓
Backend finds user by email
    ↓
Backend compares password: bcrypt.compare(pwd, hash)
    ↓
Backend creates JWT tokens
    ↓
Frontend stores tokens + redirects
```

---

## 📊 API Endpoints (All Ready!)

All these endpoints are now properly integrated:

| Method | Path | Body | Returns |
|--------|------|------|---------|
| POST | `/auth/register` | firstName, lastName, email, password, phone?, location? | { accessToken, refreshToken, user } |
| POST | `/auth/login` | email, password | { accessToken, refreshToken, user } |
| POST | `/auth/refresh` | refreshToken | { accessToken } |
| GET | `/auth/me` | (header: Authorization) | { id, email, role } |
| POST | `/auth/logout` | (header: Authorization) | { success } |

---

## 🎓 Learning Resources

Want to understand more about what changed?

**JWT Tokens:**
- [jwt.io](https://jwt.io) - Visual JWT decoder
- Access token = short-lived session token
- Refresh token = long-lived renewal token

**Bcrypt:**
- Industry standard for password hashing
- One-way encryption (can't recover original password)
- 10 rounds = ~100ms hashing time (good balance)

**axios Response Interceptor:**
- Auto-adds Bearer token to requests
- Auto-refreshes token on 401 error
- Transparent to application code

**Prisma:**
- ORM that generates type-safe database queries
- Handles migrations
- Works with SQLite, PostgreSQL, MySQL, etc.

---

## ✨ Next Phase Ideas

Want to go further? Consider:

- [ ] **Email Verification** - Send confirmation email on signup
- [ ] **Password Reset** - "Forgot password" flow
- [ ] **2FA** - Two-factor authentication
- [ ] **OAuth** - Social login (Google, GitHub)
- [ ] **Rate Limiting** - Prevent brute force attacks
- [ ] **User Roles** - Admin, Manager, User levels
- [ ] **Audit Logs** - Track who did what when
- [ ] **Session Management** - Revoke tokens, see active sessions

---

## 📞 Quick Reference

### Test User Credentials (After first signup)
```
Email: phase3test@kyndex.test
Password: Phase@Pass123
```

### Environment Variables
- Frontend: http://localhost:3002 (hardcoded in code)
- Backend: http://localhost:3001 (configured in api-client.ts)
- Database: SQLite (located at backend/prisma/dev.db)

### Important Files
- Frontend auth: `frontend/src/app/page.tsx` (lines 1128-1250)
- Backend auth: `backend/src/modules/auth/`
- Database schema: `backend/prisma/schema.prisma`

---

## ✅ You're Ready!

Phase 3 is complete. Your authentication system is:
- 🔐 **Secure** - using backend validation + bcrypt
- 🚀 **Scalable** - JWT tokens can work across services
- 🛡️ **Protected** - all inputs validated server-side
- 📱 **Live** - both servers running and responding

**Start testing now!** 🚀

Visit: **http://localhost:3002**

---

*For detailed technical information, see [PHASE_3_FINAL_SUMMARY.md](PHASE_3_FINAL_SUMMARY.md)*
