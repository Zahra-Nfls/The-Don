import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const predefinedUsername = process.env.USERNAME;
        const predefinedPasswordHash = process.env.PASSWORD_HASH;
        console.log('USERNAME:', predefinedUsername);
console.log('PASSWORD HASH:', predefinedPasswordHash);


        if (!predefinedUsername || !predefinedPasswordHash) {
          throw new Error('Username or password hash not defined.');
        }

        // Ensure the username matches
        if (credentials?.username !== predefinedUsername) {
          throw new Error('Invalid username.');
        }

        // Compare password hash
        const isValidPassword = await bcrypt.compare(credentials?.password || '', predefinedPasswordHash);
        console.log('Entered password:', credentials?.password);
        if (!isValidPassword) {
          throw new Error('Invalid password.');
        }

        // Return the user object
        return { id: '1', name: predefinedUsername };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub || '';
      return session;
    }
  },
});
