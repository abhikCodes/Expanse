import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import type { AdapterUser } from "next-auth/adapters";

const handler = NextAuth({
  adapter: {
    ...PrismaAdapter(prisma),
    async createUser(profile: AdapterUser) {
      const isTeacher = profile.email!.endsWith("@gmail.com");

      // Custom user creation logic to assign role based on email
      const newUser = await prisma.user.create({
        data: {
          name: profile.name,
          email: profile.email,
          image: profile.image,
          role: isTeacher ? "teacher" : "student",
        },
      });

      return newUser;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      // if (user?.role) {
      //   session.user.role = user.role;
      // }
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string; // Pass the access token to the session
      }
      if (token?.idToken) {
        session.idToken = token.idToken as string;
      }
      if (token?.role) {
        session.user = {
          ...session.user,
          role: token.role as string, // Add role to the session
        };
      }

      return session;
    },

    async jwt({ token, user, account }) {
      if (user?.role) {
        token.role = user.role; // Add the user role to the token
      }
      if (account?.access_token) {
        token.accessToken = account.access_token; // Add the access token to the token
      }
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      return token; // Return the JWT token with the added data
    },
    async redirect({ url, baseUrl }) {
      // Redirect users to /dashboard after successful login
      return url.startsWith(baseUrl) ? "/dashboard" : baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
