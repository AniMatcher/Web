/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import type { NextAuthOptions as NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import supabase from '../../../utils/supabase';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    newUser: '/profile', // New users will be directed here on first sign in (leave the property out if not of interest)
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (profile) {
        const { data, error } = await supabase
          .from('auth')
          .select('uuid, email')
          .eq('email', user.email || 'error');

        if (error) {
          return false;
        }

        if (data.length >= 1) {
          return true;
        }
        // TODO send them to onboarding
        return `/new-user?email=${user.email}`;
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      return Promise.resolve(token);
    },
  },
} satisfies NextAuthConfig;

export default NextAuth(authOptions);
