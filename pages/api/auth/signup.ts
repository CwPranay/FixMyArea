import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";
import path from "path";
import formidable, { File } from "formidable";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDB();

  const form = formidable({
    uploadDir: path.join(process.cwd(), "/public/uploads"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(500).json({ error: "File upload failed" });
    }

    try {
      // Validate required fields
      if (!fields.name || !fields.email || !fields.password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }

      // Extract and type fields
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
      const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
      const role = Array.isArray(fields.role) ? fields.role[0] : fields.role || "user";

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Handle authority document uploads
      let authorityDocs: string[] = [];
      if (role === "authority" && files.authorityDocs) {
        const uploadedFiles: File[] = Array.isArray(files.authorityDocs)
          ? files.authorityDocs
          : [files.authorityDocs];

        authorityDocs = uploadedFiles.map((file) => `/uploads/${file.newFilename}`);
      }

      // Create user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        authorityDocs: authorityDocs.length ? authorityDocs : undefined,
        authorityVerified: role === "authority" ? false : true,
      });

      await newUser.save();

      res.status(201).json({
        message:
          role === "authority"
            ? "Signup successful. Pending admin approval."
            : "Signup successful. You can now log in.",
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
}