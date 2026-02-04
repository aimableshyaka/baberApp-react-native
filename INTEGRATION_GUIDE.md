# Backend Integration Guide - BaberApp

## Overview

This document describes the backend integration setup for the BaberApp React Native application. Currently, the signup endpoint is fully integrated with the backend API.

---

## API Configuration

### Base URL

- **Environment**: Development
- **URL**: `http://192.168.1.97:3000`
- **Timeout**: 5000ms

Located in: [app/api/api.ts](app/api/api.ts)

```typescript
const BASE_URL = "http://192.168.1.97:3000";
```

### API Instance

The application uses **Axios** for HTTP requests with centralized configuration:

- Base URL: Configured globally
- Default Headers: `Content-Type: application/json`
- Timeout: 5 seconds

---

## Implemented Features

### 1. User Registration (Signup)

#### Endpoint

```
POST /users/register
```

#### Request Body

```json
{
  "firstname": "string",
  "email": "string",
  "pasword": "string"
}
```

> **Note**: The API expects `pasword` (with one 's') - ensure this spelling is maintained.

#### Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "firstname": "string",
    "email": "string"
  },
  "token": "jwt_token_string"
}
```

#### Implementation

**File**: [app/api/auth.ts](app/api/auth.ts)

```typescript
export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/users/register", data);
  return response.data;
};
```

**File**: [app/screens/SignupScreen.tsx](app/screens/SignupScreen.tsx)

The signup flow includes:

- Input validation (all fields required, password minimum 6 characters)
- Loading state management
- Error handling with user feedback
- Success alert and navigation to phone verification

#### Signup Flow

1. **User enters data**:
   - Full Name
   - Email
   - Password

2. **Validation**:
   - All fields are required
   - Password must be at least 6 characters
   - Email format is automatically validated by TextInput

3. **API Call**:
   - Sends registration request to backend
   - Shows loading indicator during request

4. **Response Handling**:
   - **Success**: Shows success alert and navigates to phone verification screen
   - **Error**: Displays error message from backend or generic fallback message

#### Error Handling

The signup screen catches and displays:

- Network errors
- Backend validation errors (from `error.response.data.message`)
- Generic error messages for unexpected failures

#### Code Example

```typescript
const handleSignup = async () => {
  if (!fullName || !email || !password) {
    Alert.alert("Error", "Please fill in all fields");
    return;
  }

  if (password.length < 6) {
    Alert.alert("Error", "Password must be at least 6 characters");
    return;
  }

  try {
    setLoading(true);
    const response = await registerUser({
      firstname: fullName,
      email,
      pasword: password,
    });

    Alert.alert("Success", "Account created successfully!");
    setMode("phone");
  } catch (error: any) {
    Alert.alert(
      "Signup Error",
      error.response?.data?.message ||
        "Failed to create account. Please try again.",
    );
  } finally {
    setLoading(false);
  }
};
```

---

## Role-Based Access Control (RBAC)

### Overview

The application implements role-based access control to ensure that only customers (USER role) can access the mobile app. Admin and Salon Owner accounts are restricted to the web dashboard.

### User Roles

Three roles are defined in the system:

| Role          | Mobile App | Web Dashboard | Purpose                 |
| ------------- | ---------- | ------------- | ----------------------- |
| ADMIN         | ❌ Blocked | ✅ Access     | System administration   |
| SALON_OWNER   | ❌ Blocked | ✅ Access     | Manage salon operations |
| CUSTOMER/USER | ✅ Access  | ❌ No access  | Book salon services     |

### Implementation Details

#### Role-Based Login Flow

Located in: [\_screens/SigninScreen.tsx](_screens/SigninScreen.tsx)

```typescript
const handleSignin = async () => {
  // ... validation ...

  try {
    const response = await loginUser({ email, password });
    const userRole = response.user.role;

    // Block ADMIN and SALON_OWNER users
    if (userRole === UserRole.ADMIN || userRole === UserRole.SALON_OWNER) {
      Alert.alert(
        "Web Dashboard Required",
        "This account is designed to be used on the Web Dashboard. Please log in using the web version.",
        [
          {
            text: "Open Web Version",
            onPress: () => Linking.openURL("http://localhost:5173/"),
          },
          {
            text: "Cancel",
            onPress: () => {
              setEmail("");
              setPassword("");
            },
          },
        ],
      );
      return;
    }

    // Allow CUSTOMER (USER role) users
    if (userRole === UserRole.USER) {
      await login(response.token, response.user);
      Alert.alert("Success", "Logged in successfully!");
      router.push("/screens/UserDashboard");
    }
  } catch (error) {
    // ... error handling ...
  }
};
```

**Key Features**:

- ✅ Checks role immediately after authentication
- ✅ Shows professional alert for blocked users
- ✅ Provides "Open Web Version" button linking to web dashboard
- ✅ Redirects CUSTOMER users to UserDashboard
- ✅ Prevents token storage for blocked roles

#### Protected Screen Component

Located in: [\_components/RoleBasedRoute.tsx](_components/RoleBasedRoute.tsx)

```typescript
<RoleBasedRoute allowedRoles={[UserRole.USER]}>
  <YourProtectedScreen />
</RoleBasedRoute>
```

**Features**:

- ✅ Validates user role on screen mount
- ✅ Shows loading state while checking authentication
- ✅ Alerts ADMIN/SALON_OWNER users to use web version
- ✅ Denies access for unauthorized roles
- ✅ Redirects to login if not authenticated

### UserDashboard Screen

Located in: [app/screens/UserDashboard.tsx](app/screens/UserDashboard.tsx)

```typescript
export default function UserDashboardScreen() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Prevent ADMIN and SALON_OWNER access
      if (
        user.role === UserRole.ADMIN ||
        user.role === UserRole.SALON_OWNER
      ) {
        Alert.alert(
          "Access Denied",
          "This account is designed to be used on the Web Dashboard...",
        );
      }
    }
  }, [user, isLoading]);

  return <UserDashboard />;
}
```

### Authentication Context

Located in: [\_context/AuthContext.tsx](_context/AuthContext.tsx)

```typescript
export enum UserRole {
  ADMIN = "ADMIN",
  SALON_OWNER = "SALON_OWNER",
  USER = "USER",
}

export interface User {
  id: string;
  firstname: string;
  email: string;
  role: UserRole; // Role from backend
}
```

### Login API Response Format

Expected response from backend login endpoint:

```json
{
  "message": "Login successful",
  "user": {
    "id": "697b6db6e01833f1187d1d4d",
    "firstname": "SHYAKA",
    "email": "shyakaaIamable07@gmail.com",
    "role": "CUSTOMER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

### Testing Role-Based Access

#### Test Case 1: ADMIN Login

1. Login with admin credentials
2. **Expected**: Alert dialog appears with "Web Dashboard Required" message
3. **Verify**: "Open Web Version" button navigates to `http://localhost:5173/`
4. **Verify**: User is NOT saved in AuthContext

#### Test Case 2: SALON_OWNER Login

1. Login with salon owner credentials
2. **Expected**: Alert dialog appears with "Web Dashboard Required" message
3. **Verify**: "Open Web Version" button navigates to `http://localhost:5173/`
4. **Verify**: User is NOT saved in AuthContext

#### Test Case 3: CUSTOMER Login (Success)

1. Login with customer credentials
2. **Expected**: User is saved in AuthContext
3. **Expected**: Redirected to `/screens/UserDashboard`
4. **Verify**: Can access all customer screens

#### Test Case 4: Protected Screen Access

1. Login with ADMIN/SALON_OWNER credentials → Alert shown
2. Manually navigate to protected route
3. **Expected**: Access denied alert with redirect options

### Postman Testing

Login endpoint: `POST http://localhost:3000/api/users/login`

**Request**:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response** (Admin user):

```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "firstname": "Admin Name",
    "email": "admin@example.com",
    "role": "ADMIN"
  },
  "token": "..."
}
```

Mobile app will:

- ✅ Receive the ADMIN role
- ✅ Detect role and show block alert
- ✅ NOT save token/user to AsyncStorage
- ✅ Keep user on login screen

### Configuration

#### Web Dashboard URL

Change web dashboard URL in [\_screens/SigninScreen.tsx](_screens/SigninScreen.tsx):

```typescript
Linking.openURL("http://localhost:5173/"); // Change this URL
```

Also update in [\_components/RoleBasedRoute.tsx](_components/RoleBasedRoute.tsx):

```typescript
<RoleBasedRoute
  allowedRoles={[UserRole.USER]}
  webDashboardUrl="http://localhost:5173/"  // Or your production URL
>
  <YourScreen />
</RoleBasedRoute>
```

### Common Issues

| Issue                         | Solution                                              |
| ----------------------------- | ----------------------------------------------------- |
| CUSTOMER can't login          | Verify backend returns `role: "USER"` or `"CUSTOMER"` |
| Alert doesn't show            | Check role value in backend response                  |
| Can't open web dashboard      | Verify web URL is correct and reachable               |
| UserDashboard shows blank     | Check user data is properly stored in AuthContext     |
| Role doesn't match TypeScript | Ensure enum values match backend response exactly     |

---

## Type Definitions

### RegisterData Interface

```typescript
interface RegisterData {
  firstname: string;
  email: string;
  pasword: string;
}
```

### LoginData Interface (Prepared for future use)

```typescript
interface LoginData {
  email: string;
  password: string;
}
```

---

## Testing

### Prerequisites

- Backend server running on `http://192.168.1.97:3000`
- Valid network connection to the backend server
- React Native development environment set up

### Manual Testing Steps

1. **Launch the app**: Run the development build
2. **Navigate to signup**: Click on signup button
3. **Fill in details**:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
4. **Submit**: Tap the signup button
5. **Verify**: Should see success alert and navigate to phone verification

### Common Issues

| Issue                     | Solution                                                |
| ------------------------- | ------------------------------------------------------- |
| Connection refused        | Ensure backend server is running on the correct IP/port |
| Timeout error             | Check network connectivity and backend server status    |
| "Email already exists"    | Use a unique email address                              |
| "Invalid password format" | Ensure password meets backend requirements              |

---

## Future Enhancements

### Planned Integrations

- [ ] Login endpoint integration
- [ ] Phone verification endpoint
- [ ] Password reset functionality
- [ ] Social authentication (Google, Facebook)
- [ ] Token refresh mechanism
- [ ] User profile updates

### Recommended Improvements

- Implement token storage (AsyncStorage or SecureStore)
- Add request/response interceptors for auth headers
- Implement retry logic for failed requests
- Add analytics tracking for signup flow
- Create a centralized error handler

---

## Environment Configuration

### Development

```
Base URL: http://192.168.1.97:3000
Environment: Development
Debug: Enabled
```

### Production (To be configured)

Replace the `BASE_URL` in [app/api/api.ts](app/api/api.ts) with production server URL.

---

## Dependencies

Required packages:

- `axios`: HTTP client
- `@expo/vector-icons`: Icon components
- `react-native`: Core framework

---

## Troubleshooting

### Signup fails with network error

1. Verify backend server is running
2. Check IP address and port are correct
3. Ensure device can reach the backend server
4. Check firewall settings

### API returns 400 error

1. Verify request payload structure
2. Check field names match backend expectations (especially `pasword`)
3. Validate email format
4. Ensure password meets backend requirements

### Loading indicator stuck

1. Check network connectivity
2. Verify backend server status
3. Check browser console for error details
4. Try increasing timeout value if backend is slow

---

## Support

For issues or questions regarding the integration, please refer to:

- Backend documentation
- React Native Axios documentation
- Expo documentation

---

**Last Updated**: January 29, 2026
**Version**: 1.0
