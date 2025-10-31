
import React, { useState } from 'react';
import { ProfileForm } from './components/ProfileForm';
import { PreviewDisplay } from './components/PreviewDisplay';
import { generateProfile } from './services/geminiService';
import type { FormData, ApiResponse } from './types';
import { DocumentIcon } from './components/icons/DocumentIcon';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    companyName: 'Innovate Inc.',
    tagline: 'Pioneering Tomorrow\'s Solutions',
    industry: 'Technology & AI',
    targetAudience: 'B2B enterprise clients',
    tone: 'formal',
    brandColors: {
      primary: '#3b82f6',
      secondary: '#1f2937',
    },
    brandFonts: {
      heading: 'Inter',
      body: 'Roboto',
    },
    logoImage: null,
    slides: [
      { id: Date.now().toString(), title: 'About Us', text: 'We are a leading tech company focused on AI-driven solutions.', image_description: 'A modern office with people collaborating' },
      { id: (Date.now() + 1).toString(), title: 'Our Mission', text: 'To empower businesses with intelligent technology and drive innovation.', image_description: 'Abstract representation of neural networks' }
    ],
    contactInfo: '123 Tech Lane, Silicon Valley, CA\ncontact@innovate.com\ninnovate-inc.com',
    locale: 'en',
  });
  
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      const response = await generateProfile(formData);
      setApiResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DocumentIcon className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Gemini PDF Profile Maker
            </h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:pr-4">
             <ProfileForm 
              formData={formData} 
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:pl-4">
            <PreviewDisplay 
              response={apiResponse}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>

       <footer className="text-center py-6 mt-8 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          <p>Powered by Google Gemini. Designed for modern business presentations.</p>
       </footer>
    </div>
  );
};

export default App;
