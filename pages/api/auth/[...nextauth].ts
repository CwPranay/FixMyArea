import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";

// Cached MongoDB connection for serverless (Vercel) environment
let cachedDB: any = null;

async function dbConnect() {
  if (cachedDB) return cachedDB;
  cachedDB = await connectDB();
  return cachedDB;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        // Block authority login if not verified
        if (user.role === "authority" && user.authorityVerified === "pending") {
          throw new Error("Authority account pending verification");
        }
         if (user.role === "authority" && user.authorityVerified === "rejected") {
          throw new Error("Authority account rejected");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
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

  // Important: define this env var in Vercel for production
  // NEXTAUTH_URL=https://fixmy-area.vercel.app
});
