import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import SettingsModal from '../components/SettingsModal/SettingsModal';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { API } from '../config/api';
import {
  Table2,
  Download,
  FileSpreadsheet,
  Home,
  Loader2,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

const SETTINGS_TAB_LABELS = {
  waterCooling: 'Water Cooling',
  dustAnalysis: 'Dust Analysis',
  additives: 'Additives',
  gradeSpecs: 'Grade Specifications',
  chemicalEnergy: 'Chemical Energy Thresholds',
  longTermYield: 'Long-term Yield',
  thresholds: 'Thresholds',
};

// Read-only view of the 7 settings tabs the backend actually used for this
// run (echoed back in summary.settings / results/<job_id>.json). No editing
// here — just showing the values, one collapsible block per tab.
function UsedParametersPanel({ settings }) {
  const [openTab, setOpenTab] = useState(null);

  if (!settings) return null;

  const renderValue = (val) => {
    if (val === '' || val === null || val === undefined) return '—';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
        <span className="text-sm font-semibold text-gray-700">
          Parameters used for this run
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {Object.keys(SETTINGS_TAB_LABELS).map((tabKey) => {
          const data = settings[tabKey];
          const isOpen = openTab === tabKey;

          return (
            <div key={tabKey}>
              <button
                type="button"
                onClick={() => setOpenTab(isOpen ? null : tabKey)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <span className="font-medium">{SETTINGS_TAB_LABELS[tabKey]}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-3">
                  {Array.isArray(data) ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr>
                            {data[0] &&
                              Object.keys(data[0]).map((col) => (
                                <th
                                  key={col}
                                  className="text-left font-semibold text-gray-500 uppercase tracking-wide px-2 py-1.5 border-b border-gray-100"
                                >
                                  {col}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((row, i) => (
                            <tr key={i} className="border-b border-gray-50 last:border-0">
                              {Object.values(row).map((v, j) => (
                                <td key={j} className="px-2 py-1.5 text-gray-600">
                                  {renderValue(v)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {Object.entries(data || {}).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5">
                          <span className="text-gray-500">{k}</span>
                          <span className="text-gray-800 font-medium">{renderValue(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const statusStyles = {
  PERFECT: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  GOOD: 'bg-amber-50 text-amber-700 border border-amber-200',
  ACCEPTABLE: 'bg-red-50 text-red-700 border border-red-200',
};

export default function Result() {
  const router = useRouter();
  const { isAuthenticated, isChecking } = useAuth();
  const { jobId, resultData, resultTotal, resultSettings } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [downloadingResults, setDownloadingResults] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState(null);

  const rows = resultData || [];
  const isPreview = resultTotal > rows.length;

  // Calls the backend, which opens a native "Save As" dialog and writes the
  // full optimization workbook to the path the user picks
  // (see /api/save_local/<job_id> in app.py).
  const handleDownloadResults = async () => {
    setDownloadMessage(null);
    setDownloadingResults(true);

    try {
      if (!jobId) {
        setDownloadMessage({
          type: 'error',
          text: 'No job found for this session. Please run the optimization again.',
        });
        return;
      }

      const response = await fetch(API.saveLocal(jobId));
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setDownloadMessage({
          type: 'success',
          text: `File saved successfully:\n${data.path}`,
        });
      } else if (data.status === 'cancelled') {
        // User closed the Save As dialog without picking a location.
      } else {
        setDownloadMessage({
          type: 'error',
          text: `Failed to save file: ${data.error || 'Unknown error'}`,
        });
      }
    } catch (err) {
      setDownloadMessage({
        type: 'error',
        text: 'Could not reach the server to save the file.',
      });
    } finally {
      setDownloadingResults(false);
    }
  };

  // The backend currently only returns a preview of the results (see the
  // `summary` field in /api/status/<job_id>). The full workbook is what
  // "Download Results" saves; this button exports that same preview data
  // that is already on screen as a small CSV summary, entirely client-side.
  const handleDownloadSummary = () => {
    setDownloadMessage(null);

    if (rows.length === 0) {
      setDownloadMessage({
        type: 'error',
        text: 'No results available to export yet.',
      });
      return;
    }

    const header = ['Heat No.', 'FZ', 'IO', 'FL', 'HU', 'Status'];
    const csvRows = rows.map((r) =>
      [r.heat_no, r.FZ, r.IO, r.FL, r.HU, r.status].join(',')
    );
    const csv = [header.join(','), ...csvRows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `summary_${jobId || 'results'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f9] text-gray-800 flex flex-col font-sans">
      {/* Auth check */}
      {isChecking && (
        <div className="min-h-screen bg-gradient-to-b from-white via-[#f1f3f9] to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      )}

      {!isAuthenticated && !isChecking && null}

      {isAuthenticated && !isChecking && (
        <>
      <Head>
        <title>EEA - Results</title>
      </Head>

      {/* Header */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Results Card */}
      <main className="flex-1 flex flex-col items-center p-6 max-w-5xl mx-auto w-full">
        <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 transition-all">
          <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl">
                <Table2 className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#1e1b4b]">
                  Optimization Results
                </h1>

                <p className="text-sm text-gray-500">
                  Review the full results below, then download the files you
                  need.
                </p>
              </div>
            </div>

            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1.5">
              {isPreview
                ? `Showing ${rows.length} of ${resultTotal} heats`
                : `${rows.length} heats`}
            </span>
          </div>

          {/* Parameters actually used for this run (7 tabs, read-only) */}
          <UsedParametersPanel settings={resultSettings} />

          {/* Results table */}
          <div className="mb-8 rounded-2xl border border-gray-200 overflow-hidden">
            <div className="max-h-[420px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr>
                    {['Heat No.', 'FZ', 'IO', 'FL', 'HU', 'Status'].map(
                      (col) => (
                        <th
                          key={col}
                          className="text-left font-semibold text-gray-500 uppercase tracking-wide text-[11px] px-4 py-3 border-b border-gray-200"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center text-gray-400 text-sm py-10"
                      >
                        No results to display yet. Run the optimization from
                        the Range Analysis step first.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, idx) => (
                      <tr
                        key={row.heat_no ?? idx}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70"
                      >
                        <td className="px-4 py-2.5 text-gray-800 font-medium">
                          {row.heat_no}
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">
                          {row.FZ}
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">
                          {row.IO}
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">
                          {row.FL}
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">
                          {row.HU}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                              statusStyles[row.status] ||
                              'bg-gray-50 text-gray-600 border border-gray-200'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {isPreview && (
            <p className="text-xs text-gray-400 text-right -mt-5 mb-6">
              Full results for all {resultTotal} heats are included in the
              downloaded Excel file.
            </p>
          )}

          {/* Download feedback message */}
          {downloadMessage && (
            <div
              className={`mb-6 p-4 rounded-2xl text-sm whitespace-pre-line ${
                downloadMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {downloadMessage.text}
            </div>
          )}

          {/* Download buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleDownloadResults}
              disabled={downloadingResults}
              className="flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3.5 px-6 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {downloadingResults ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              <span>Download Results (.xlsx)</span>
            </button>

            <button
              onClick={handleDownloadSummary}
              className="flex items-center justify-center gap-2.5 bg-white hover:bg-indigo-50/60 text-indigo-700 font-medium py-3.5 px-6 rounded-2xl border-2 border-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <FileSpreadsheet className="h-5 w-5" />
              <span>Download Summary (.csv)</span>
            </button>
          </div>

          {/* Back to Home */}
          <div className="flex items-center justify-center pt-4 border-t border-gray-100">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2.5 text-sm font-medium text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50/50 px-5 py-2.5 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </main>
        </>
      )}
    </div>
  );
}
