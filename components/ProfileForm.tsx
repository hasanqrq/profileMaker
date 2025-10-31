
import React from 'react';
import type { FormData, Slide } from '../types';
import { SlideInput } from './SlideInput';
import { PlusIcon } from './icons/PlusIcon';

interface ProfileFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ formData, setFormData, onSubmit, isLoading }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [group, key] = name.split('.');
    setFormData(prev => ({
      ...prev,
      [group]: { ...prev[group as keyof FormData] as object, [key]: value },
    }));
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [group, key] = name.split('.');
    setFormData(prev => ({
      ...prev,
      [group]: { ...prev[group as keyof FormData] as object, [key]: value },
    }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSlideChange = (id: string, field: keyof Omit<Slide, 'id'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.map(slide => slide.id === id ? { ...slide, [field]: value } : slide)
    }));
  };
  
  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: '',
      text: '',
      image_description: ''
    };
    setFormData(prev => ({ ...prev, slides: [...prev.slides, newSlide] }));
  };

  const removeSlide = (id: string) => {
    setFormData(prev => ({ ...prev, slides: prev.slides.filter(slide => slide.id !== id) }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Company Profile Details</h2>
      
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company Name" className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text" name="tagline" value={formData.tagline} onChange={handleInputChange} placeholder="Tagline" className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} placeholder="Industry" className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="Target Audience" className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Brand Identity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Color</label>
          <input type="color" name="brandColors.primary" value={formData.brandColors.primary} onChange={handleColorChange} className="w-full h-10 p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secondary Color</label>
          <input type="color" name="brandColors.secondary" value={formData.brandColors.secondary} onChange={handleColorChange} className="w-full h-10 p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 cursor-pointer" />
        </div>
        <select name="tone" value={formData.tone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="formal">Formal</option>
          <option value="friendly">Friendly</option>
          <option value="bold">Bold</option>
          <option value="luxury">Luxury</option>
          <option value="minimalist">Minimalist</option>
        </select>
        <select name="locale" value={formData.locale} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="en">English</option>
          <option value="ar">Arabic (RTL)</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="tr">Turkish</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Logo (Optional)</label>
        <input type="file" onChange={handleLogoChange} accept="image/png, image/jpeg, image/svg+xml" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300 dark:hover:file:bg-blue-900/30"/>
      </div>

      {/* Slides */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Content Slides</h3>
        {formData.slides.map((slide, index) => (
          <SlideInput key={slide.id} slide={slide} index={index} onSlideChange={handleSlideChange} onRemoveSlide={removeSlide} />
        ))}
        <button onClick={addSlide} className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          <PlusIcon className="h-5 w-5" />
          <span>Add Another Slide</span>
        </button>
      </div>

      {/* Contact Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Information</label>
        <textarea name="contactInfo" value={formData.contactInfo} onChange={handleInputChange} placeholder="Address, Phone, Email, Website" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Profile'
        )}
      </button>
    </div>
  );
};
