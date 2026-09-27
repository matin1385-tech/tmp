import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, FileSpreadsheet, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const REQUIRED_FILES = [
  { key: 'DRI Analysis.xlsx', title: 'DRI Analysis', description: 'DRI chemical composition and parameters' },
  { key: 'Melt Analysis.xlsx', title: 'Melt Analysis', description: 'Spectrometer and chemical heat samples' },
  { key: 'Melt Operation.xlsx', title: 'Melt Operation', description: 'Electrical energy and operational logs' },
  { key: 'Slag Analysis.xlsx', title: 'Slag Analysis', description: 'Slag composition and basicity ratios' },
];

export default function FileUploadSection() {
  const { files, setFileByName } = useApp();
  const [errors, setErrors] = useState({});
  const fileInputRefs = useRef({});

  const validateAndAddFile = (key, file) => {
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isValidExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    if (!isValidExcel) {
      setErrors((prev) => ({
        ...prev,
        [key]: 'Invalid file format. Only Excel files (.xlsx) are allowed.',
      }));
      return;
    }

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });

    setFileByName(key, file);
  };

  const handleDrop = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndAddFile(key, e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveFile = (key) => {
    setFileByName(key, null);
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    if (fileInputRefs.current[key]) {
      fileInputRefs.current[key].value = '';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Process Data Upload</h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload the four required operational datasets in Excel format (.xlsx)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REQUIRED_FILES.map(({ key, title, description }) => {
          const uploadedFile = files[key];
          const fileError = errors[key];

          return (
            <div
              key={key}
              onDrop={(e) => handleDrop(e, key)}
              onDragOver={handleDragOver}
              className={`relative border-2 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between ${
                uploadedFile
                  ? 'border-emerald-500 bg-emerald-50/30'
                  : fileError
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-dashed border-slate-300 bg-white hover:border-indigo-500 hover:bg-slate-50/50 shadow-sm'
              }`}
            >
              <input
                type="file"
                accept=".xlsx, .xls"
                ref={(el) => (fileInputRefs.current[key] = el)}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    validateAndAddFile(key, e.target.files[0]);
                  }
                }}
              />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        uploadedFile
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-indigo-50 text-indigo-600'
                      }`}
                    >
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
                      <span className="text-xs font-mono text-slate-400">{key}</span>
                    </div>
                  </div>

                  {uploadedFile && (
                    <span className="flex items-center text-xs font-medium text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mb-4">{description}</p>
              </div>

              {fileError && (
                <div className="flex items-center gap-2 p-2.5 mb-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              {uploadedFile ? (
                <div className="flex items-center justify-between bg-white border border-emerald-200 rounded-xl p-3 shadow-xs">
                  <div className="truncate mr-2">
                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(key)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[key]?.click()}
                  className="w-full py-3 px-4 border border-slate-200 hover:border-indigo-400 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50/30 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Select File or Drag & Drop</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
