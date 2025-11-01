# Authentication System Setup

## Overview

This authentication system supports **email/password** authentication only. OAuth/SSO has been removed.

## Backend Endpoints

### Public Routes
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/signin` - Sign in with email and password

### Protected Routes (require JWT token)
- `GET /api/auth/verify` - Verify if current token is valid
- `GET /api/auth/profile` - Get current user profile

## Request/Response Examples

### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "fullName": "John Doe",
  "username": "johndoe" // Optional, auto-generated if not provided
}

Response:
{
  "message": "User created successfully",
  "user": {
    "id": "clxxx...",
    "name": "John Doe",
    "email": "user@example.com",
    "username": "johndoe_abc123"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Signin
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response:
{
  "message": "Sign in successful",
  "user": {
    "id": "clxxx...",
    "name": "John Doe",
    "email": "user@example.com",
    "username": "johndoe_abc123"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Request
```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
{
  "user": {
    "id": "clxxx...",
    "name": "John Doe",
    "email": "user@example.com",
    "username": "johndoe_abc123",
    "role": "USER",
    "xpTotal": 0,
    "lastLoginAt": "2025-01-15T10:30:00Z"
  }
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/usda_db"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d" # Optional, defaults to 7 days

# Gemini API (for other features)
GEMINI_API_KEY="your-gemini-api-key"

# Server Port
PORT=5000
```

## Database Setup

1. Make sure PostgreSQL is running
2. Update the Prisma schema (username is now optional):
   ```prisma
   model User {
     username     String?   @unique // Optional
     displayName  String?   // Full name
     ...
   }
   ```

3. Create and run migration:
   ```bash
   cd backend
   npx prisma migrate dev --name make_username_optional
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Security Features

- **Password Hashing**: Uses bcrypt with 12 rounds
- **JWT Tokens**: Secure token-based authentication
- **Password Validation**: Minimum 8 characters required
- **Email Validation**: Unique email addresses enforced
- **Token Expiration**: Configurable (default 7 days)

## Frontend Integration

The frontend `AuthModal` component supports:
- Email/password signup
- Email/password signin
- Forgot password (UI only, backend implementation pending)

The frontend automatically:
- Stores JWT token in `localStorage` as `usda_token`
- Stores user data in `localStorage` as `userData`
- Attaches token to all API requests via `Authorization: Bearer <token>` header

## Testing

### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "fullName": "Test User"
  }'
```

### Test Signin
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid email or password"
}
```

### 409 Conflict
```json
{
  "error": "User with this email already exists"
}
```

## Files Structure

```
backend/
├── Controllers/
│   └── authController.js      # Signup, signin, profile handlers
├── Middlewares/
│   └── auth.js                # JWT verification middleware
├── Routes/
│   └── authRoutes.js          # Auth route definitions
├── lib/
│   └── auth.js                # Password hashing, JWT utilities
└── prisma/
    └── schema.prisma          # Database schema
```

## Next Steps (Optional Enhancements)

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Account lockout after failed attempts
- [ ] Refresh tokens for better security
- [ ] Session management
- [ ] Two-factor authentication (2FA)

