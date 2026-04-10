import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Pre-computed dummy hash used to run bcrypt.compare even when no user is found,
// preventing timing-based user enumeration attacks.
const DUMMY_HASH =
  "$2a$12$OxLAA.9UPpjyJsX3RMnmZOQ8yWd7u1e1tVpZEXIr7mLiU4qU9LHSG";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Normalize email to match how it is stored at signup.
        const email = (credentials.email as string).trim().toLowerCase();
        const password = credentials.password as string;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        // Always run bcrypt.compare to prevent timing-based user enumeration.
        const hashToCompare = user?.passwordHash ?? DUMMY_HASH;
        const isValid = await bcrypt.compare(password, hashToCompare);

        if (!user || !user.passwordHash || !isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin ?? false,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        (session.user as { isAdmin?: boolean }).isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
