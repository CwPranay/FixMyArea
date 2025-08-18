"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { useTranslations } from "next-intl";
import { X, FileText, Image } from "lucide-react";

interface FileUploaderProps {
  onFilesUploaded: (files: { url: string; name: string }[]) => void;
  maxFiles?: number;
  required?: boolean;
}

export default function FileUploader({ 
  onFilesUploaded, 
  maxFiles = 5, 
  required = false 
}: FileUploaderProps) {
  const t = useTranslations('Auth.Signup');
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; name: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = (res: any) => {
    console.log("Upload complete:", res);
    // Handle the response properly based on UploadThing's response format
    const newFiles = Array.isArray(res) ? res.map((file: any) => ({
      url: file.url || file.data?.url,
      name: file.name || file.data?.name || 'Uploaded file'
    })) : [];
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);
    setIsUploading(false);
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    setIsUploading(false);
    
    // Show user-friendly error message
    if (error.message.includes('UPLOADTHING_SECRET')) {
      alert('UploadThing not configured. Please add your credentials to .env.local file.');
    } else {
      alert('Upload failed. Please try again or check your internet connection.');
    }
  };

  const handleUploadBegin = () => {
    setIsUploading(true);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
        <UploadDropzone
          endpoint="authorityDocuments"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          onUploadBegin={handleUploadBegin}
        />
        
        {isUploading && (
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-slate-600">{t('uploadingDocuments')}</span>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">{t('uploadedFiles')}:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  {file.name.toLowerCase().endsWith('.pdf') ? (
                    <FileText className="w-5 h-5 text-red-500" />
                  ) : (
                    <Image className="w-5 h-5 text-blue-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-700 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t('uploadedSuccessfully')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
        <p className="font-medium mb-1">{t('uploadRequirements')}:</p>
        <ul className="space-y-1">
          <li>• {t('maxFileSize')}: 4MB</li>
          <li>• {t('maxFiles')}: {maxFiles}</li>
          <li>• {t('allowedFormats')}: JPG, PNG, PDF</li>
          {required && <li>• {t('documentsRequired')}</li>}
        </ul>
      </div>
    </div>
  );
} 