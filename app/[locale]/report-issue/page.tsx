"use client";

import { useState } from 'react';
import { useTranslations } from "next-intl";

export default function ReportIssue() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: ''
    });
    const t = useTranslations('reportIssue');

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        // Only allow one image
        const file = files[0];
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            alert(t('form.images.invalidTypeError'));
            return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert(t('form.images.maxSizeError'));
            return;
        }

        setSelectedImage(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (event) => {
            setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        // Reset the file input
        const fileInput = document.getElementById('images') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.title || !formData.description || !formData.location) {
            alert(t('form.validationError'));
            return;
        }
        
        console.log('Form submitted:', formData);
        console.log('Image:', selectedImage);
        // Handle form submission here
        alert(t('form.successMessage'));
        // Reset form
        setFormData({
            title: '',
            description: '',
            location: ''
        });
        setSelectedImage(null);
        setImagePreview(null);
    };

    const tipsList = t.raw('form.tips.items') as string[];

    return (
        <div className="min-h-screen text-black [font-family:var(--font-poppins)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
                    <p className="text-gray-600">{t('subtitle')}</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                    <div className="space-y-6">
                        {/* Issue Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('form.issueTitle.label')}
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder={t('form.issueTitle.placeholder')}
                                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('form.description.label')}
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={5}
                                placeholder={t('form.description.placeholder')}
                                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('form.location.label')}
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder={t('form.location.placeholder')}
                                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                {t('form.location.helpText')}
                            </p>
                        </div>

                        {/* Image Upload - Single Image Only */}
                        <div>
                            <label htmlFor="images" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('form.images.label')}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    id="images"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <label htmlFor="images" className="cursor-pointer">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="mt-2">
                                        <span className="text-blue-600 font-medium">{t('form.images.uploadText')}</span>
                                        <p className="text-gray-500 text-sm mt-1">{t('form.images.singleFileInfo')}</p>
                                    </div>
                                </label>
                            </div>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-3">
                                        {t('form.images.selectedImage')}
                                    </p>
                                    <div className="relative group max-w-xs mx-auto">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-contain rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                        >
                                            ×
                                        </button>
                                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                            
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        {t('form.tips.title')}
                                    </h3>
                                    <div className="mt-1 text-sm text-blue-700">
                                        <ul className="list-disc list-inside space-y-1">
                                            {tipsList.map((tip, index) => (
                                                <li key={index}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r btn-primary-gradient text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {t('form.submit')}
                            </button>
                        </div>

                        {/* Form Footer */}
                        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                            <p>{t('form.footer')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}