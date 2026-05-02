// @ts-nocheck
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const DEMO_USER = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'demo@atlas.com',
  name: 'Atlas Demo',
  role: 'admin',
};

async function findUserByEmail(email?: string) {
  if (!email) return null;

  try {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user[0] ?? null;
  } catch (error) {
    console.warn('Auth fallback: users table or database connection issue', error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await findUserByEmail(credentials.email);
        if (!user) {
          if (credentials.email === DEMO_USER.email && credentials.password === 'password') {
            return DEMO_USER;
          }
          return null;
        }

        // In production, hash password
        // For demo, assume password is 'password'
        if (credentials.password !== 'password') return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};