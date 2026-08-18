# User login setup

The public user login page is available at `/login`.

## Firebase Authentication providers

Enable these providers in Firebase Console under `Authentication` -> `Sign-in method`:

- Email/Password
- Google
- Apple
- Phone

## Firestore user list

Every signed-in user is saved automatically here:

```text
users/{firebaseAuthUid}
```

Fields include:

```json
{
  "uid": "firebase-auth-uid",
  "email": "user@example.com",
  "displayName": "",
  "photoURL": "",
  "providerId": "password | google.com | apple.com | phone",
  "emailVerified": false,
  "online": true,
  "lastSeenAt": "server timestamp",
  "updatedAt": "server timestamp"
}
```

The hidden admin page shows these users in the `Website Users` panel. Admins can use `Make Admin` to add a user's email to `admin/access.emails`.

## Phone login

Phone login uses Firebase reCAPTCHA. Phone numbers must include country code, for example:

```text
+491701234567
```

## Apple login

Apple login uses Firebase OAuth provider `apple.com`. It only works after the Apple provider is fully configured in Firebase.