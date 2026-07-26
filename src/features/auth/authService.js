export const authService = {
  async getCurrentUser() {
    return null;
  },
  async signIn() {
    throw new Error('Auth provider is not configured yet.');
  },
  async signOut() {
    return true;
  },
};
