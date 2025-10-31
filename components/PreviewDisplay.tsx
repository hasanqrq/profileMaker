
import React from 'react';
import type { ApiResponse } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface PreviewDisplayProps {
  response: ApiResponse | null;
  isLoading: boolean;
  error: string | null;
}

const Placeholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <h3 className="text-lg font-semibold">Profile Preview</h3>
    <p className="max-w-xs">Your generated company profile will appear here once you submit the form.</p>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
     <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <h3 className="text-lg font-semibold">Generating Your Profile...</h3>
    <p className="max-w-xs">Gemini is crafting your professional document. This may take a moment.</p>
  </div>
);


const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold">An Error Occurred</h3>
        <p className="max-w-md text-sm">{message}</p>
    </div>
);


export const PreviewDisplay: React.FC<PreviewDisplayProps> = ({ response, isLoading, error }) => {
  const handleDownloadPdf = () => {
    if (response && response.pdf_base64) {
      const byteCharacters = atob(response.pdf_base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${response.meta.company_name}_Profile.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (response) {
      return (
        <div className="flex flex-col h-full">
          <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-bold">Preview: {response.meta.company_name}</h3>
            {response.pdf_base64 && (
              <button onClick={handleDownloadPdf} className="flex items-center space-x-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors">
                <DownloadIcon className="h-5 w-5" />
                <span>Download PDF</span>
              </button>
            )}
          </div>
          <div className="flex-grow border border-t-0 rounded-b-lg border-gray-200 dark:border-gray-700 overflow-hidden">
            <iframe
              srcDoc={response.html_fallback}
              title="Profile Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      );
    }
    return <Placeholder />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md h-[calc(100vh-200px)] min-h-[500px]">
      {renderContent()}
    </div>
  );
};
