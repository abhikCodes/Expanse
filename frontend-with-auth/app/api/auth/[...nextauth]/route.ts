import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // Using JWT strategy
  },
  callbacks: {
    async signIn({ user }) {
      // Check if the user already exists in the database
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (existingUser) {
        const isTeacher = user.email!.endsWith("@gmail.com");
        await prisma.user.update({
          where: { email: user.email! },
          data: {
            role: isTeacher ? "teacher" : "student",
          },
        });
      }

      return true;
    },

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
  },
});

export { handler as GET, handler as POST };
