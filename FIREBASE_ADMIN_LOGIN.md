# Firebase admin login

The hidden admin page at `/secret-admin` uses Firebase Authentication with Email/Password.

## Easy admin list in Firestore

Use one central Firestore document where you can enter admin emails.

Create this path:

```text
admin/access
```

Add these fields:

```json
{
  "active": true,
  "emails": ["admin@example.com"]
}
```

The email must be written exactly as the Firebase Authentication user email, but lowercase is safest.

## Firebase Console steps

1. Go to `Authentication` -> `Sign-in method`.
2. Enable `Email/Password`.
3. Go to `Authentication` -> `Users`.
4. Create your admin user with email and password.
5. Go to `Firestore Database`.
6. Create collection `admin`.
7. Inside it create document `access`.
8. Add field `active` as Boolean `true`.
9. Add field `emails` as Array.
10. Add your admin email as an array item.

## Supported old structure

The old `adminUsers` collection still works too, but the central `admin/access` document is easier.

Old example:

```text
adminUsers/admin@example.com
```

```json
{
  "role": "admin",
  "active": true
}
```

## Notes

- The old `VITE_ADMIN_PASSCODE` flow is no longer used.
- Normal guide pages no longer show inline edit buttons after admin login.
- Editing should happen inside `/secret-admin` through the Builder.
## Website users in Firestore

When any Firebase-authenticated user signs in on the website, the app writes or updates this document:

```text
users/{firebaseAuthUid}
```

Example fields:

```json
{
  "uid": "firebase-auth-uid",
  "email": "user@example.com",
  "displayName": "",
  "providerId": "password",
  "emailVerified": false,
  "online": true,
  "lastSeenAt": "server timestamp",
  "updatedAt": "server timestamp"
}
```

The admin page shows this `users` collection in the `Website Users` panel. From there an existing signed-in user email can be added to `admin/access.emails` with `Make Admin`.