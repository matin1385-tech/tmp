import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import SettingsModal from '../components/SettingsModal/SettingsModal';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { API } from '../config/api';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Table2,
  Settings2,
} from 'lucide-react';

export default function Processing() {
  const router = useRouter();
  const { isAuthenticated, isChecking } = useAuth();
  const { jobId, setResultData, setResultTotal, setResultSettings } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [status, setStatus] = useState('running'); // 'running' | 'done' | 'error'
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('Initializing…');
  const [errorMessage, setErrorMessage] = useState('');

  const intervalRef = useRef(null);

  // Real polling of the optimization job status (see /api/status/<job_id>
  // in app.py). The Flask worker thread updates `progress`,
  // `progress_label`, `status` and, once done, `summary` (top-10 preview
  // rows + total count).
  useEffect(() => {
    if (!jobId) {
      setStatus('error');
      setErrorMessage(
        'No active job found for this session. Please start the optimization again from Range Analysis.'
      );
      return;
    }

    const poll = async () => {
      try {
        const res = await fetch(API.status(jobId));

        if (res.status === 404) {
          clearInterval(intervalRef.current);
          setStatus('error');
          setErrorMessage('Job not found. It may have expired.');
          return;
        }

        const data = await res.json();

        if (data.status === 'running') {
          setProgress(data.progress || 0);
          setProgressLabel(data.progress_label || 'Running…');
        } else if (data.status === 'done') {
          clearInterval(intervalRef.current);
          setProgress(100);
          setProgressLabel('Done');
          setResultData((data.summary && data.summary.rows) || []);
          setResultTotal((data.summary && data.summary.total) || 0);
          setResultSettings((data.summary && data.summary.settings) || null);
          setStatus('done');
        } else if (data.status === 'error') {
          clearInterval(intervalRef.current);
          setStatus('error');
          setErrorMessage(data.error || 'Unknown error during optimization.');
        }
      } catch (err) {
        clearInterval(intervalRef.current);
        setStatus('error');
        setErrorMessage(
          'Could not reach the server. Make sure the backend is running.'
        );
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 1200);

    return () => clearInterval(intervalRef.current);
  }, [jobId]);

  const handleViewResults = () => {
    clearInterval(intervalRef.current);
    router.push('/result');
  };

  const handleBackToRange = () => {
    clearInterval(intervalRef.current);
    router.push('/range');
  };

  // Auth check
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

  return (
    <div className="min-h-screen bg-[#f1f3f9] text-gray-800 flex flex-col font-sans">
      <Head>
        <title>EEA - Processing</title>
      </Head>

      {/* Header */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Processing Card */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 transition-all">
          <div className="flex items-center justify-center gap-3 border-b border-gray-100 pb-5 mb-8">
            <div
              className={`p-3 rounded-2xl ${
                status === 'error'
                  ? 'bg-red-50 text-red-600'
                  : status === 'done'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-indigo-50 text-indigo-700'
              }`}
            >
              {status === 'running' && (
                <Loader2 className="h-6 w-6 animate-spin" />
              )}
              {status === 'done' && <CheckCircle2 className="h-6 w-6" />}
              {status === 'error' && <XCircle className="h-6 w-6" />}
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#1e1b4b]">
                {status === 'running' && 'Processing Data'}
                {status === 'done' && 'Processing Complete'}
                {status === 'error' && 'Processing Error'}
              </h1>

              <p className="text-sm text-gray-500">
                {status === 'running' &&
                  'Running the optimization. Please wait.'}
                {status === 'done' &&
                  'Optimization finished. Your results are ready.'}
                {status === 'error' &&
                  'Something went wrong while processing your data.'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 px-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{progressLabel}</span>
              <span className="text-sm font-bold text-indigo-700">
                {progress}%
              </span>
            </div>

            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  status === 'done'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                    : status === 'error'
                    ? 'bg-red-500'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Error Message */}
          {status === 'error' && errorMessage && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
              {errorMessage}
            </div>
          )}

          {/* Bottom Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={handleBackToRange}
              disabled={status === 'running'}
              className={`text-sm font-medium transition-colors ${
                status === 'running'
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-800 cursor-pointer'
              }`}
            >
              Back to Range Analysis
            </button>

            {status === 'done' && (
              <button
                onClick={handleViewResults}
                className="flex items-center gap-2.5 bg-[#1e1b4b] hover:bg-indigo-950 text-white font-medium py-3 px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Table2 className="h-4 w-4" />
                <span>View Results</span>
              </button>
            )}

            {status === 'error' && (
              <button
                onClick={handleBackToRange}
                className="flex items-center gap-2.5 bg-[#1e1b4b] hover:bg-indigo-950 text-white font-medium py-3 px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Settings2 className="h-4 w-4" />
                <span>Try Again</span>
              </button>
            )}

            {status === 'running' && (
              <button
                disabled
                className="flex items-center gap-2.5 bg-gray-200 text-gray-400 font-medium py-3 px-8 rounded-xl cursor-not-allowed"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing…</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
