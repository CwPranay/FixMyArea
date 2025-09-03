import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { baseAuthOptions } from "@/lib/auth";

let cachedDB: any = null;
async function dbConnect() {
  if (cachedDB) return cachedDB;
  cachedDB = await connectDB();
  return cachedDB;
}

export const authOptions: NextAuthOptions = {
  ...baseAuthOptions,
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

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

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
};

export default NextAuth(authOptions);
