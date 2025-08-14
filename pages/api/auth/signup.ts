import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";
import path from "path";
import formidable from "formidable";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDB();

  const form = formidable({
    uploadDir: path.join(process.cwd(), "/public/uploads"), // Store in /public/uploads
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "File upload failed" });
    }

    try {
      const { name, email, password, role } = fields;

      // Check if email already exists
      const existingUser = await User.findOne({ email: email?.toString() });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password.toString(), 10);
      }

      // Handle authority document uploads
      let authorityDocs: string[] = [];
      if (role?.toString() === "authority" && files.authorityDocs) {
        const uploadedFiles = Array.isArray(files.authorityDocs)
          ? files.authorityDocs
          : [files.authorityDocs];

        authorityDocs = uploadedFiles.map((file) => `/uploads/${file.newFilename}`);
      }

      // Create user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role?.toString() || "user",
        authorityDocs: authorityDocs.length ? authorityDocs : undefined,
        authorityVerified: role?.toString() === "authority" ? false : true,
      });

      await newUser.save();

      res.status(201).json({
        message:
          role?.toString() === "authority"
            ? "Signup successful. Pending admin approval."
            : "Signup successful. You can now log in.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });
}