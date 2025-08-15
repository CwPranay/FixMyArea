import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "../../../lib/db";
import User from "@/models/user"
import bcrypt from "bcrypt";

export default NextAuth({
  providers: [
    // Email/Password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        // Block authority login if not verified
        if (user.role === "authority" && !user.authorityVerified) {
          throw new Error("Authority account pending verification");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    // Google OAuth login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      // If Google login
      if (account?.provider === "google") {
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Default Google signups to "user" role
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            password: null, // no password for Google
            role: "user", // can be changed later if needed
            authorityVerified: true, // in Google signup
          });
        }

        // Block authority Google login if not verified
        if (existingUser.role === "authority" && !existingUser.authorityVerified) {
          throw new Error("Authority account pending verification");
        }

        // Attach DB id to user
        user.id = existingUser._id.toString();
        user.role = existingUser.role;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.id;
        token.role = user.role || token.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },
});
