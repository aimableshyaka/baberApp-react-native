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
      error.response?.data?.message || "Failed to create account. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
```

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

| Issue | Solution |
|-------|----------|
| Connection refused | Ensure backend server is running on the correct IP/port |
| Timeout error | Check network connectivity and backend server status |
| "Email already exists" | Use a unique email address |
| "Invalid password format" | Ensure password meets backend requirements |

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
