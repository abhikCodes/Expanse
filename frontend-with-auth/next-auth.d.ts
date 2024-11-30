import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's role (e.g., 'teacher', 'student') */
      role: string;
    } & DefaultSession["user"];

    /** The user's access token */
    accessToken?: string; // Add the accessToken to the session type
    idToken?: string;
  }

  interface User {
    /** The user's role (e.g., 'teacher', 'student') */
    role: string;
  }
}
