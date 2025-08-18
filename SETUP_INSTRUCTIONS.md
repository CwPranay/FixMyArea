# UploadThing Setup Instructions

## Step 1: Create UploadThing Account
1. Go to [https://uploadthing.com](https://uploadthing.com)
2. Sign up for a free account
3. Create a new project

## Step 2: Get Your Credentials
1. In your UploadThing dashboard, go to "API Keys"
2. Copy your `Secret Key` and `App ID`

## Step 3: Set Up Environment Variables
Create a `.env.local` file in your project root (same folder as package.json) and add:

```env
UPLOADTHING_SECRET=your_secret_key_here
UPLOADTHING_APP_ID=your_app_id_here
```

## Step 4: Configure UploadThing Dashboard
1. In your UploadThing dashboard, go to "Settings"
2. Add your domain to allowed origins:
   - For development: `http://localhost:3000` and `http://localhost:3001`
   - For production: your actual domain

## Step 5: Test the Upload
1. Restart your development server: `npm run dev`
2. Go to the signup page
3. Select "Authority" role
4. Try uploading a document

## Troubleshooting

### If you see "Please upload required documents":
- Check that your `.env.local` file exists and has the correct credentials
- Make sure you've restarted the development server after adding environment variables
- Check the browser console for any error messages

### If upload fails:
- Verify your UploadThing credentials are correct
- Check that your domain is added to allowed origins in UploadThing dashboard
- Ensure files are under 4MB and are images or PDFs

### If styles are broken:
- The styles should now be working with the custom CSS I added
- If not, try refreshing the page

## Current Status
✅ File uploader component created
✅ UploadThing API routes configured  
✅ Integration with signup form complete
✅ Multi-language support added
✅ Custom styling applied

⏳ **You need to complete**: Add your UploadThing credentials to `.env.local` 