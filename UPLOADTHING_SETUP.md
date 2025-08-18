# UploadThing Setup Guide

## Prerequisites
1. Create an account at [UploadThing](https://uploadthing.com)
2. Create a new project in your UploadThing dashboard

## Environment Variables Setup

Create a `.env.local` file in your project root and add the following variables:

```env
# UploadThing Configuration
# Get these from your UploadThing dashboard: https://uploadthing.com/dashboard
UPLOADTHING_SECRET=your_uploadthing_secret_key_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Database Configuration (if using MongoDB)
MONGODB_URI=your_mongodb_connection_string_here
```

## How to Get UploadThing Credentials

1. Go to [UploadThing Dashboard](https://uploadthing.com/dashboard)
2. Create a new project or select an existing one
3. Go to the "API Keys" section
4. Copy your `Secret Key` and `App ID`
5. Paste them in your `.env.local` file

## Features Implemented

### File Uploader Component
- **Location**: `app/[locale]/components/FileUploader.tsx`
- **Features**:
  - Drag & drop file upload
  - Multiple file selection
  - File type validation (images and PDFs)
  - File size validation (max 4MB)
  - Progress indication
  - File preview with remove functionality
  - Responsive design

### UploadThing Configuration
- **Core Config**: `app/api/uploadthing/core.ts`
- **API Route**: `app/api/uploadthing/route.ts`
- **Utility**: `utils/uploadthing.ts`

### Integration with Signup
- Authority signup now includes document upload
- Files are uploaded to UploadThing before account creation
- File URLs are stored with the user account

## Usage

When a user signs up as an authority:
1. They select their verification documents
2. Files are uploaded to UploadThing
3. File URLs are stored with the account
4. Account is created with document references

## File Types Supported
- Images: JPG, PNG, GIF, etc.
- Documents: PDF
- Maximum file size: 4MB
- Maximum files: 5 per upload

## Security Features
- File type validation
- File size limits
- Secure file storage via UploadThing
- No files stored locally

## Troubleshooting

### Common Issues:
1. **Upload fails**: Check your UploadThing credentials in `.env.local`
2. **File type rejected**: Ensure files are images or PDFs
3. **File too large**: Ensure files are under 4MB
4. **CORS errors**: Make sure your domain is whitelisted in UploadThing dashboard

### Development vs Production:
- For development: Use `http://localhost:3000` in your UploadThing dashboard
- For production: Add your production domain to the allowed origins in UploadThing dashboard 