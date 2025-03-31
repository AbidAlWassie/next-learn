// app/(auth)/auth.config.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const prisma = new PrismaClient();

const getBaseDomain = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.COOKIE_DOMAIN;
  }
  return undefined; // For development, don't set a domain
};

export default {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/error",
    newUser: "/",
    verifyRequest: "/verify-request",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async redirect({ baseUrl }) {
      // Redirect to /dashboard after successful login
      return `${baseUrl}/dashboard`;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: getBaseDomain(),
      },
    },
  },
} satisfies NextAuthConfig;
