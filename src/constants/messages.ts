/**
 * Verified against Parabank UI copy. Do not "fix" grammar — must match production text.
 */
export const Messages = {
  invalidLogin: 'The username and password could not be verified.',
  usernameRequired: 'Please enter a username and password.',
  registrationWelcome: 'Your account was created successfully. You are now logged in.',
  usernameAlreadyExists: 'This username already exists.',
  passwordsDoNotMatch: 'Passwords did not match.',
  requiredSuffix: 'is required.',
  loggedInHeadingPrefix: 'Welcome',
} as const;
