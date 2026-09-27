import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import FileUploadSection from '../components/FileUploadSection';
import SettingsModal from '../components/SettingsModal/SettingsModal';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, AlertCircle, Upload } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { files, isSettingsSaved } = useApp();
  const { isAuthenticated, isChecking } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#f1f3f9] to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const requiredFiles = [
    'DRI Analysis.xlsx',
    'Melt Analysis.xlsx',
    'Melt Operation.xlsx',
    'Slag Analysis.xlsx',
  ];

  // No network call here anymore — the files stay as File objects in
  // context and are sent together with the settings + range in ONE request
  // to /api/process when the user hits "Run Optimization" on the next page.
  const handleNext = () => {
    setErrorMessage('');

    const missingFiles = requiredFiles.filter((fileName) => !files[fileName]);
    if (missingFiles.length > 0) {
      setErrorMessage(
        `Please upload all required files. Missing files: ${missingFiles.join(', ')}`
      );
      return;
    }

    const invalidFormatFiles = requiredFiles.filter((fileName) => {
      const file = files[fileName];
      return file && !file.name.toLowerCase().endsWith('.xlsx');
    });
    if (invalidFormatFiles.length > 0) {
      setErrorMessage('All uploaded files must be in .xlsx format.');
      return;
    }

    if (!isSettingsSaved) {
      setErrorMessage(
        'Please open the Settings section and save your changes before continuing.'
      );
      return;
    }

    router.push('/range');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f1f3f9] to-indigo-50 text-gray-800 flex flex-col font-sans">
      <Head>
        <title>EEA - Process Optimization</title>
      </Head>

      {/* Header */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-5xl mx-auto w-full">
        <div className="w-full relative overflow-hidden bg-white rounded-3xl shadow-xl shadow-indigo-100/60 border border-gray-100 p-8 md:p-10 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1e1b4b] via-indigo-500 to-indigo-300" />
          <div className="flex items-center justify-center gap-3 border-b border-gray-100 pb-5 mb-8">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl">
              <Upload className="h-6 w-6" />
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#1e1b4b]">
                Upload Input Data
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                To start the optimization process, please select all four
                Excel files and review the process settings.
              </p>
            </div>
          </div>

          {/* File Upload Section */}
          <FileUploadSection />

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm animate-shake">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Next Step Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-3 bg-[#1e1b4b] hover:bg-indigo-950 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3.5 px-8 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Next: Range Analysis</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}