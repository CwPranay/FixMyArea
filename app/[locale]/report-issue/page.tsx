"use client";
import { useState } from 'react';
import { useTranslations } from "next-intl";
import LocationPicker from '../components/LocationPicker';

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: ''
  });
  const t = useTranslations('reportIssue');

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormErrors(prev => ({ ...prev, [name]: '' })); // clear error
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setFormErrors(prev => ({ ...prev, image: t('form.images.invalidTypeError') }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({ ...prev, image: t('form.images.maxSizeError') }));
      return;
    }

    setSelectedImage(file);
    setFormErrors(prev => ({ ...prev, image: '' }));

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('images') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setFormErrors(prev => ({ ...prev, location: 'Geolocation is not supported by this browser.' }));
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();

          let address = `${latitude}, ${longitude}`;
          if (data.display_name) {
            address = data.display_name;
          }

          setFormData(prev => ({
            ...prev,
            location: `${address} (Lat: ${latitude}, Lng: ${longitude})`
          }));
          setFormErrors(prev => ({ ...prev, location: '' }));
        } catch {
          setFormData(prev => ({
            ...prev,
            location: `Lat: ${latitude}, Lng: ${longitude}`
          }));
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setFormErrors(prev => ({ ...prev, location: errorMessage }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let errors: { [key: string]: string } = {};
    if (!formData.title) errors.title = t('form.validationError');
    if (!formData.description) errors.description = t('form.validationError');
    if (!formData.location) errors.location = t('form.validationError');

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setFormSuccess(null);
      return;
    }

    console.log('Form submitted:', formData);
    console.log('Image:', selectedImage);

    setFormSuccess(t('form.successMessage'));
    setFormErrors({});
    setFormData({ title: '', description: '', location: '' });
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
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors ${
                  formErrors.title ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                }`}
              />
              {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
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
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors resize-vertical ${
                  formErrors.description ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                }`}
              />
              {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {t('form.location.label')}
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 disabled:opacity-50 transition-colors"
                >
                  {isGettingLocation ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Use My Location
                    </>
                  )}
                </button>
              </div>

              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder={t('form.location.placeholder')}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors mb-2 ${
                  formErrors.location ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                }`}
              />
              {formErrors.location && <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>}

              <LocationPicker
                onLocationSelect={({ lat, lng, address }) => {
                  setFormData(prev => ({
                    ...prev,
                    location: `${address} (Lat: ${lat}, Lng: ${lng})`
                  }));
                  setFormErrors(prev => ({ ...prev, location: '' }));
                }}
                selectedLocation={formData.location ? {
                  lat: parseFloat(formData.location.match(/Lat: ([-\d.]+)/)?.[1] || '0'),
                  lng: parseFloat(formData.location.match(/Lng: ([-\d.]+)/)?.[1] || '0'),
                  address: formData.location.split(' (Lat:')[0] || ''
                } : undefined}
              />
            </div>

            {/* Image Upload */}
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
              {formErrors.image && <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>}

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
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
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

            {/* Submit */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r btn-primary-gradient text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-colors duration-200"
              >
                {t('form.submit')}
              </button>
              {formSuccess && (
                <p className="text-green-600 text-center mt-3">{formSuccess}</p>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
              <p>{t('form.footer')}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
