# Testing & Deployment Guide

## ✅ Implementation Complete

All role-based access control features have been implemented. Below is a comprehensive guide for testing and deployment.

---

## What's Ready to Test

### 1. Login Role-Based Access

- ✅ Customer login → Redirects to UserDashboard
- ✅ Admin login → Shows blocking alert
- ✅ Salon Owner login → Shows blocking alert
- ✅ Web Dashboard button → Opens browser to http://localhost:5173/

### 2. Protected Routes

- ✅ Direct access to protected screens validated
- ✅ Unauthorized users show access denied
- ✅ Authorized users see content

### 3. Token Management

- ✅ Customer tokens saved to AsyncStorage
- ✅ Admin/Salon Owner tokens NOT saved
- ✅ Proper cleanup on logout

### 4. User Experience

- ✅ Professional alert messages
- ✅ Clear navigation flows
- ✅ Proper error handling

---

## Testing Instructions

### Prerequisites

1. Backend server running on `http://localhost:3000`
2. Web dashboard running on `http://localhost:5173` (for testing web link)
3. React Native app in dev mode
4. Test credentials for all three roles

### Test Scenario 1: Customer Login ✅

**Test Data**:

- Email: customer@example.com
- Password: password123
- Expected Role: USER

**Steps**:

1. Open app on mobile/simulator
2. Enter customer email and password
3. Tap "Sign in"
4. **Expected Result**: See "Success" alert, redirected to UserDashboard
5. **Verification**:
   - User data visible on dashboard
   - Can navigate within app
   - Token stored in AsyncStorage

**Command for Postman** (to verify backend):

```
POST http://localhost:3000/api/users/login
Body: {"email":"customer@example.com","password":"password123"}
Expected role: "USER"
```

---

### Test Scenario 2: Admin Login - Blocked ✅

**Test Data**:

- Email: admin@example.com
- Password: password123
- Expected Role: ADMIN

**Steps**:

1. Open app on mobile/simulator
2. Enter admin email and password
3. Tap "Sign in"
4. **Expected Result**: See alert "Web Dashboard Required"
5. **Alert should have**:
   - Title: "Web Dashboard Required"
   - Message: "This account is designed to be used on the Web Dashboard..."
   - Button 1: "Open Web Version"
   - Button 2: "Cancel"
6. **Verification**:
   - Tap "Open Web Version" → Browser opens http://localhost:5173/
   - Tap "Cancel" → Email and password fields clear
   - User remains on login screen
   - Token NOT saved to AsyncStorage

**Command for Postman** (to verify backend):

```
POST http://localhost:3000/api/users/login
Body: {"email":"admin@example.com","password":"password123"}
Expected role: "ADMIN"
```

---

### Test Scenario 3: Salon Owner Login - Blocked ✅

**Test Data**:

- Email: salonowner@example.com
- Password: password123
- Expected Role: SALON_OWNER

**Steps**:

1. Open app on mobile/simulator
2. Enter salon owner email and password
3. Tap "Sign in"
4. **Expected Result**: See alert (same as admin)
5. **Verification**:
   - All same as Admin test
   - Properly blocked from mobile app
   - Token NOT saved

**Command for Postman** (to verify backend):

```
POST http://localhost:3000/api/users/login
Body: {"email":"salonowner@example.com","password":"password123"}
Expected role: "SALON_OWNER"
```

---

### Test Scenario 4: Invalid Credentials ✅

**Test Data**:

- Email: nonexistent@example.com
- Password: wrongpassword

**Steps**:

1. Open app
2. Enter invalid credentials
3. Tap "Sign in"
4. **Expected Result**: Error alert with message from backend
5. **Verification**:
   - Remain on login screen
   - Can retry with different credentials

---

### Test Scenario 5: Protected Screen Direct Access ✅

**Steps**:

1. Logout completely (clear AsyncStorage)
2. Try to navigate directly to `/screens/UserDashboard`
3. **Expected Result**: Access denied screen
4. **Verification**:
   - See "Not Authenticated" message
   - "Go to Login" button appears
   - Tap button → Redirected to login

---

### Test Scenario 6: Token Persistence ✅

**Steps**:

1. Login as customer
2. Close app (don't logout)
3. Reopen app
4. **Expected Result**: Should go directly to UserDashboard
5. **Verification**:
   - User data restored from AsyncStorage
   - Token still valid
   - No need to login again

---

### Test Scenario 7: Logout ✅

**Steps**:

1. Login as customer (or already logged in)
2. Tap logout button on UserDashboard
3. **Expected Result**: Redirected to login screen
4. **Verification**:
   - AsyncStorage cleared
   - Token removed
   - User data removed
   - Must login again to access app

---

## Debugging & Verification

### Check Browser Console

```javascript
// Verify API response has role
console.log("API Response:", response);
console.log("User Role:", response.user.role);

// Should see one of: "ADMIN", "SALON_OWNER", "USER"
```

### Check React Native Console

```javascript
// Add to SigninScreen after role check
console.log("Checked role:", userRole);
console.log("Is ADMIN?", userRole === UserRole.ADMIN);
console.log("Is SALON_OWNER?", userRole === UserRole.SALON_OWNER);
console.log("Is USER?", userRole === UserRole.USER);
```

### Verify AsyncStorage

```javascript
import AsyncStorage from "@react-native-async-storage/async-storage";

// After login (customer only):
const token = await AsyncStorage.getItem("auth_token");
const user = await AsyncStorage.getItem("auth_user");
console.log("Stored token:", token);
console.log("Stored user:", user);

// After logout:
const tokenAfterLogout = await AsyncStorage.getItem("auth_token");
console.log("Token after logout:", tokenAfterLogout); // Should be null
```

---

## Common Test Issues & Fixes

### Issue: Admin alert doesn't show

**Solution**:

1. Check backend returns `"ADMIN"` (exact case)
2. Verify `Linking` is imported in SigninScreen
3. Check Alert is imported from react-native

### Issue: Can't open web dashboard

**Solution**:

1. Verify web app is running on http://localhost:5173/
2. Test URL directly in browser first
3. Check phone has internet connection

### Issue: Customer can't login

**Solution**:

1. Verify backend returns `"USER"` role
2. Check email and password are correct
3. Verify backend server is running
4. Check network connectivity

### Issue: User token not persisting

**Solution**:

1. Verify login response includes token
2. Check AsyncStorage.setItem is called
3. Verify user data is JSON serializable

---

## Performance Checklist

- [ ] Login completes in < 2 seconds
- [ ] Alert appears instantly after login
- [ ] No lag when checking roles
- [ ] Navigation to dashboard is smooth
- [ ] App doesn't freeze during role validation

---

## Security Checklist

- [ ] Admin tokens NOT stored locally
- [ ] Salon owner tokens NOT stored locally
- [ ] Customer tokens stored securely
- [ ] Token cleared on logout
- [ ] User data cleared on logout
- [ ] No hardcoded credentials in code
- [ ] API uses HTTPS in production

---

## Browser/Device Testing Matrix

### Mobile Devices

- [ ] iOS Simulator
- [ ] Android Emulator
- [ ] Physical iPhone
- [ ] Physical Android

### Role Testing

- [ ] Customer role on all devices
- [ ] Admin role on all devices
- [ ] Salon owner role on all devices

### Network Conditions

- [ ] WiFi
- [ ] 4G/LTE
- [ ] Poor connection (test timeouts)
- [ ] No connection (test error handling)

---

## Edge Cases to Test

1. **Rapid Login Attempts**
   - Click sign in multiple times
   - Expected: Only one request sent, no duplicate logins

2. **Network Interruption During Login**
   - Kill network during API call
   - Expected: Error message shown, user remains on login

3. **Very Long Credentials**
   - Enter 1000+ character email/password
   - Expected: Fields truncated appropriately

4. **Special Characters in Credentials**
   - Email with special chars: user+test@example.com
   - Expected: Sent correctly to API

5. **Session Timeout**
   - Login, wait for token to expire
   - Try to access protected screen
   - Expected: Automatically redirected to login

6. **Multiple Browser Tabs/Windows**
   - Login in one tab
   - Switch to another tab
   - Expected: Session shared appropriately

---

## Deployment Checklist

Before deploying to production:

### Code Review

- [ ] All console.log statements removed (except errors)
- [ ] No hardcoded API URLs (use env vars)
- [ ] No debug code left in
- [ ] Code formatted and linted
- [ ] Type errors resolved
- [ ] No unused imports

### Configuration

- [ ] Update API BASE_URL to production server
- [ ] Update web dashboard URL to production
- [ ] Set appropriate timeouts
- [ ] Configure error logging
- [ ] Set up analytics (optional)

### Testing

- [ ] All test scenarios pass
- [ ] No console errors
- [ ] Works on target devices
- [ ] Network error handling works
- [ ] Performance acceptable

### Security

- [ ] No credentials in code
- [ ] HTTPS enabled for API
- [ ] Token encryption enabled
- [ ] CORS properly configured
- [ ] Rate limiting in place

### Documentation

- [ ] README updated
- [ ] API docs updated
- [ ] Deployment docs created
- [ ] Support guides prepared
- [ ] Team briefed on changes

---

## Rollback Plan

If issues occur post-deployment:

1. **Revert Code**

   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Clear User Cache**

   ```bash
   Clear app cache on devices
   Force app update
   ```

3. **Monitor Issues**
   - Check error logs
   - Contact support tickets
   - Gather user feedback

4. **Fix & Re-deploy**
   - Fix identified issues
   - Test thoroughly
   - Deploy again

---

## Post-Deployment Monitoring

### First Week

- Monitor login errors
- Check API response times
- Verify role-based blocking works
- Collect user feedback

### Ongoing

- Track login success rate
- Monitor blocked login attempts
- Check for unusual patterns
- Maintain user support

---

## Support Contact

For testing questions or issues:

1. **Development Team**: [Your dev team contact]
2. **QA Team**: [Your QA team contact]
3. **Backend Support**: [Backend team contact]
4. **DevOps**: [DevOps team contact]

---

## Sign-Off

- [ ] QA Testing Complete
- [ ] Security Review Passed
- [ ] Performance Acceptable
- [ ] Documentation Approved
- [ ] Ready for Deployment

---

**Last Updated**: February 4, 2026
**Status**: Ready for QA Testing ✅
