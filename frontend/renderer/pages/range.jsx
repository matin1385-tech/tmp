import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import SettingsModal from '../components/SettingsModal/SettingsModal';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { API } from '../config/api';
import { ArrowLeft, Play, Layers, Hash, Loader2 } from 'lucide-react';

export default function RangeAnalysis() {
  const router = useRouter();
  const { isAuthenticated, isChecking } = useAuth();
  const { files, setJobId, settingsData, setResultData, setResultTotal, setResultSettings } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [analysisMode, setAnalysisMode] = useState('all'); // 'all' or 'range'
  const [rangeValues, setRangeValues] = useState({
    from: '',
    to: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setRangeValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  const handleRunOptimization = async () => {
    setError('');

    if (analysisMode === 'range') {
      if (!rangeValues.from || !rangeValues.to) {
        setError(
          'Please enter both the start and end values of the range.'
        );
        return;
      }

      if (Number(rangeValues.from) > Number(rangeValues.to)) {
        setError(
          'The start value cannot be greater than the end value.'
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const startHeat = analysisMode === 'range' ? rangeValues.from : '';
      const endHeat = analysisMode === 'range' ? rangeValues.to : '';

      // ONE call to the backend: the 4 files + the 7-tab settings + the
      // range all go together in a single multipart request to
      // /api/process (see runner.py). The result comes back immediately —
      // no separate upload/validate/run/poll round-trip.
      const formData = new FormData();
      formData.append('dri_file', files['DRI Analysis.xlsx']);
      formData.append('melt_op_file', files['Melt Operation.xlsx']);
      formData.append('melt_an_file', files['Melt Analysis.xlsx']);
      formData.append('slag_file', files['Slag Analysis.xlsx']);
      
      // Send individual settings as separate form parameters
      formData.append('waterCooling', JSON.stringify(settingsData.WaterCooling || []));
      formData.append('dustAnalysis', JSON.stringify(settingsData.DustAnalysis || []));
      formData.append('additives', JSON.stringify(settingsData.Additives || []));
      formData.append('gradeSpecs', JSON.stringify(settingsData.GradeSpecification || []));
      formData.append('chemicalEnergy', JSON.stringify(settingsData.ChemicalEnergyThreshold || []));
      formData.append('chemicalEnergyRHS', JSON.stringify(settingsData.ChemicalEnergyRHS || {}));
      formData.append('longTermYield', JSON.stringify(settingsData.TermYield || []));
      formData.append('thresholds', JSON.stringify(settingsData.Tolerance || {}));
      
      formData.append('start_heat', startHeat);
      formData.append('end_heat', endHeat);

      const runRes = await fetch(API.process, {
        method: 'POST',
        body: formData,
      });
      const runData = await runRes.json();

      if (!runRes.ok || runData.success === false) {
        setError(runData.error || 'Failed to run the optimization.');
        return;
      }

      setJobId(runData.job_id);
      setResultData(runData.rows || []);
      setResultTotal(runData.total || 0);
      setResultSettings(runData.settings || null);
      router.push('/result');
    } catch (err) {
      setError('Could not reach the server. Make sure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f1f3f9] text-gray-800 flex flex-col font-sans">
      <Head>
        <title>EEA - Range Analysis</title>
      </Head>

      {/* Header */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Range Analysis Card */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 transition-all">
          <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl">
                <Layers className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#1e1b4b]">
                  Range Analysis
                </h1>

                <p className="text-sm text-gray-500">
                  Define the analysis range and run the optimization.
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50/50 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Analysis Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* All Option */}
            <div
              onClick={() => {
                setAnalysisMode('all');
                setError('');
              }}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                analysisMode === 'all'
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  id="mode-all"
                  name="analysisMode"
                  checked={analysisMode === 'all'}
                  onChange={() => setAnalysisMode('all')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />

                <label
                  htmlFor="mode-all"
                  className="font-semibold text-gray-800 cursor-pointer text-base"
                >
                  All Data
                </label>
              </div>

              <p className="text-xs text-gray-500 mr-7 leading-relaxed">
                Perform calculations and optimization on all available
                records in the input files.
              </p>
            </div>

            {/* Range Option */}
            <div
              onClick={() => {
                setAnalysisMode('range');
                setError('');
              }}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                analysisMode === 'range'
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  id="mode-range"
                  name="analysisMode"
                  checked={analysisMode === 'range'}
                  onChange={() => setAnalysisMode('range')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />

                <label
                  htmlFor="mode-range"
                  className="font-semibold text-gray-800 cursor-pointer text-base"
                >
                  Custom Range
                </label>
              </div>

              <p className="text-xs text-gray-500 mr-7 leading-relaxed">
                Select a specific subset of records or heat numbers based on
                a custom range.
              </p>
            </div>
          </div>

          {/* Range Input Fields */}
          {analysisMode === 'range' && (
            <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-2xl">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Hash className="h-4 w-4 text-indigo-600" />
                Range Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    From:
                  </label>

                  <input
                    type="number"
                    name="from"
                    value={rangeValues.from}
                    onChange={handleInputChange}
                    placeholder="e.g. 1001"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    To:
                  </label>

                  <input
                    type="number"
                    name="to"
                    value={rangeValues.to}
                    onChange={handleInputChange}
                    placeholder="e.g. 1050"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Bottom Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={() => router.push('/')}
              className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            >
              Cancel and Go Back
            </button>

            <button
              onClick={handleRunOptimization}
              disabled={isSubmitting}
              className="flex items-center gap-2.5 bg-[#1e1b4b] hover:bg-indigo-950 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Starting…</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Run Optimization</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}