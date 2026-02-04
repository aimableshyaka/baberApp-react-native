# Quick Reference: Role-Based Access Control

## How It Works

### 🔐 Three-Level Protection

```
Level 1: Login Screen
├─ Check role after API response
├─ Block ADMIN/SALON_OWNER users
└─ Redirect CUSTOMER users to app

Level 2: Protected Routes
├─ UseEffect validates role on mount
├─ Show alert for unauthorized access
└─ Redirect based on role

Level 3: AuthContext
├─ Only store valid customer tokens
└─ Validate on app startup
```

---

## Implementation Checklist

### ✅ What's Been Done

- [x] SigninScreen role checking implemented
- [x] Web Dashboard URL linking (Linking API)
- [x] RoleBasedRoute component created
- [x] UserDashboard protected screen created
- [x] Screen routing setup complete
- [x] Documentation updated
- [x] Test cases documented

### 🚀 Ready to Use

#### For Login

Just sign in with credentials - the role check happens automatically.

#### For Protecting Screens

```typescript
import { RoleBasedRoute } from "../_components/RoleBasedRoute";
import { UserRole } from "../_context/AuthContext";

export default function MyScreen() {
  return (
    <RoleBasedRoute allowedRoles={[UserRole.USER]}>
      <MyScreenContent />
    </RoleBasedRoute>
  );
}
```

---

## Testing Commands

### Test with Postman

```
POST http://localhost:3000/api/users/login

Body:
{
  "email": "admin@example.com",
  "password": "password123"
}

Expected response (will be blocked on mobile):
{
  "user": {
    "role": "ADMIN"
  },
  "token": "..."
}
```

### Test Scenarios

| Scenario                           | Expected Result             |
| ---------------------------------- | --------------------------- |
| Customer login                     | ✅ Allowed to UserDashboard |
| Admin login                        | ❌ Alert + Block            |
| Salon owner login                  | ❌ Alert + Block            |
| Direct route access (unauthorized) | ❌ Access denied screen     |

---

## Customization Points

### 1. Change Web Dashboard URL

**File**: `_screens/SigninScreen.tsx`

```typescript
Linking.openURL("http://your-domain.com/dashboard");
```

### 2. Add More Protected Screens

**File**: `app/screens/YourScreen.tsx`

```typescript
import { RoleBasedRoute } from "../_components/RoleBasedRoute";

<RoleBasedRoute allowedRoles={[UserRole.USER]}>
  <Content />
</RoleBasedRoute>
```

### 3. Modify Alert Messages

**File**: `_screens/SigninScreen.tsx`

```typescript
Alert.alert("Your Title", "Your message here", [
  { text: "Button", onPress: () => {} },
]);
```

---

## Key Components

### SigninScreen.tsx

- **What**: Main login entry point
- **Where**: `_screens/SigninScreen.tsx`
- **Does**: Checks user role after login
- **Blocks**: ADMIN and SALON_OWNER users

### RoleBasedRoute.tsx

- **What**: Reusable protected screen wrapper
- **Where**: `_components/RoleBasedRoute.tsx`
- **Does**: Validates role before rendering screen
- **Usage**: Wrap any screen you want to protect

### UserDashboard Screen

- **What**: Main customer dashboard
- **Where**: `app/screens/UserDashboard.tsx`
- **Does**: Renders customer content (protected)
- **Routes to**: `/screens/UserDashboard`

### AuthContext.tsx

- **What**: Auth state and role definitions
- **Where**: `_context/AuthContext.tsx`
- **Does**: Stores user, token, and role info
- **Enum**: UserRole (ADMIN, SALON_OWNER, USER)

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User Opens App                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │ Has Saved Token?                     │
        └──┬──────────────────────┬────────────┘
           │ YES                  │ NO
           ▼                      ▼
    ┌────────────┐         ┌────────────┐
    │ Get Saved  │         │ Show Login │
    │ User Role  │         │ Form       │
    └──┬─────────┘         └────────────┘
       │                        │
       │ USER ✅               │
       ├──────────────┬────────┼─────────────┐
       │              │        │             │
       ▼              ▼        ▼             ▼
   Dashboard    ┌─────────────────────┐  Invalid
              │ User Enters Creds    │
              │ Taps Sign In         │
              └──────────┬───────────┘
                         │
                    ┌────▼────┐
                    │ API Call│
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼ ADMIN         ▼ USER ✅        ▼ ERROR
     BLOCKED        Dashboard       Show Error
     + Alert
```

---

## Debugging Tips

### Check Role Value

```typescript
console.log("User role:", response.user.role);
// Should be: "ADMIN", "SALON_OWNER", or "USER"
```

### Verify Storage

```typescript
const token = await AsyncStorage.getItem("auth_token");
const user = await AsyncStorage.getItem("auth_user");
console.log("Stored:", { token, user });
```

### Test Protected Route

```typescript
// Manually set user role and verify access
const { user } = useAuth();
console.log("Current user role:", user?.role);
console.log("Allowed roles:", [UserRole.USER]);
```

---

## Common Issues & Fixes

### Issue: Role doesn't match

**Fix**: Check exact spelling and case

```typescript
"ADMIN" ✅  (not "admin" or "Admin")
"USER" ✅   (not "user" or "CUSTOMER")
```

### Issue: Alert doesn't show

**Fix**: Verify Alert is imported

```typescript
import { Alert } from "react-native";
```

### Issue: Can't open web version

**Fix**: Verify URL is correct

```typescript
// Test the URL in browser first
http://localhost:5173/  // Correct format
```

---

## Environment Variables (Optional)

For production, use environment variables:

```typescript
const WEB_DASHBOARD_URL =
  process.env.EXPO_PUBLIC_WEB_DASHBOARD_URL || "http://localhost:5173/";

Linking.openURL(WEB_DASHBOARD_URL);
```

Then set in `.env`:

```
EXPO_PUBLIC_WEB_DASHBOARD_URL=https://your-domain.com/dashboard
```

---

## Performance Notes

- ✅ Role check is synchronous (instant)
- ✅ No additional API calls needed
- ✅ Uses existing login response
- ✅ Minimal memory overhead
- ✅ No performance impact

---

## Security Notes

- ✅ Tokens NOT stored for ADMIN/SALON_OWNER
- ✅ Role checked before route navigation
- ✅ Multiple validation layers
- ✅ No tokens persisted to AsyncStorage for blocked users
- ✅ Proper logout clears all data

---

Last Updated: February 4, 2026
