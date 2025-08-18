# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# UploadThing Configuration (Token-based)
UPLOADTHING_TOKEN=eyJhcGlLZXkiOiJza19saXZlXzRjMjE2NjY1YTUzMzgyYzdhNTdiZDFjNzVlYmMwMDI1NmRmY2I4NjU4Y2Y1MzExNjFmMmUxMjc4ZTg2OTY2YjkiLCJhcHBJZCI6ImFzbmFycDQ1MGMiLCJyZWdpb25zIjpbInNlYTEiXX0=

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## How to Get These Values

### 1. MongoDB URI
- Go to [MongoDB Atlas](https://cloud.mongodb.com) or use a local MongoDB instance
- Create a new cluster/database
- Get your connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database_name`

### 2. UploadThing Token (Already Provided)
- You already have your UploadThing token
- This token contains your API key and app ID
- No need to get separate credentials

### 3. NextAuth Secret
- Generate a random string (you can use: `openssl rand -base64 32`)
- Or use any secure random string

## Testing the Setup

After adding these environment variables:

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test the signup functionality**:
   - Go to the signup page
   - Try creating an account
   - Check if files upload properly

## Troubleshooting

### If you get "MONGODB_URI not defined":
- Make sure your `.env.local` file exists in the project root
- Check that the MongoDB URI is correct
- Restart the development server

### If file uploads fail:
- Verify your UploadThing token is correct
- Check that your domain is added to UploadThing allowed origins
- Ensure files are under 4MB and are images/PDFs

### If signup fails:
- Check the browser console for specific error messages
- Verify all environment variables are set correctly
- Check that MongoDB is accessible

## Current Status
✅ Signup API route created (App Router format)
✅ User model configured
✅ Database connection setup
✅ File upload integration ready
✅ UploadThing token configuration

⏳ **You need to complete**: Add environment variables to `.env.local` 