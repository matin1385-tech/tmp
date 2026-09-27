import React, { useState } from 'react';
import { Settings, X, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { API } from '../../config/api';

import TabWaterCooling from './TabWaterCooling';
import TabDustAnalysis from './TabDustAnalysis';
import TabAdditives from './TabAdditives';
import TabGradeSpecs from './TabGradeSpecs';
import TabChemicalEnergy from './TabChemicalEnergy';
import TabLongTermYield from './TabLongTermYield';
import TabThresholds from './TabThresholds';

export default function SettingsModal({ isOpen, onClose }) {
  const {
    settingsData,
    setSettingsData,
    setIsSettingsSaved,
  } = useApp();

  const [activeTab, setActiveTab] = useState('waterCooling');
  const [localSettings, setLocalSettings] = useState(settingsData);

  // Update localSettings whenever settingsData changes (e.g., from API fetch)
  React.useEffect(() => {
    console.log('SettingsModal: settingsData updated:', settingsData);
    setLocalSettings(settingsData);
  }, [settingsData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const tabs = [
    {
      id: 'WaterCooling',
      label: 'Water Cooling',
    },
    {
      id: 'DustAnalysis',
      label: 'Dust Analysis',
    },
    {
      id: 'Additives',
      label: 'Additives',
    },
    {
      id: 'GradeSpecification',
      label: 'Grade Specifications',
    },
    {
      id: 'ChemicalEnergyThreshold',
      label: 'Chemical Energy Thresholds',
    },
    {
      id: 'TermYield',
      label: 'Long-term Yield',
    },
    {
      id: 'Tolerance',
      label: 'Thresholds',
    },
  ];

  const updateTabData = (key, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      console.log('SettingsModal: Saving settings to localStorage...');
      // Save to localStorage
      localStorage.setItem('eea_settings', JSON.stringify(localSettings));
      setSettingsData(localSettings);
      setIsSettingsSaved(true);
      onClose();
      console.log('Settings saved to localStorage successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    }
  };

  const handleClose = () => {
    setLocalSettings(settingsData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-7xl max-h-[92vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Settings className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Process Parameters
              </h2>

              <p className="text-xs text-slate-500">
                Configure process parameters and optimization thresholds
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="shrink-0 border-b border-slate-200 bg-white">
          <div className="flex overflow-x-auto px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 font-semibold text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">

          {activeTab === 'WaterCooling' && (
            <TabWaterCooling
              data={localSettings?.WaterCooling || []}
              onChange={(updated) =>
                updateTabData('WaterCooling', updated)
              }
            />
          )}

          {activeTab === 'DustAnalysis' && (
            <TabDustAnalysis
              data={localSettings?.DustAnalysis || []}
              onChange={(updated) =>
                updateTabData('DustAnalysis', updated)
              }
            />
          )}

          {activeTab === 'Additives' && (
            <TabAdditives
              data={localSettings?.Additives || []}
              onChange={(updated) =>
                updateTabData('Additives', updated)
              }
            />
          )}

          {activeTab === 'GradeSpecification' && (
            <TabGradeSpecs
              data={localSettings?.GradeSpecification || []}
              onChange={(updated) =>
                updateTabData('GradeSpecification', updated)
              }
            />
          )}

          {activeTab === 'ChemicalEnergyThreshold' && (
            <TabChemicalEnergy
              data={localSettings?.ChemicalEnergyThreshold || []}
              rhs={localSettings?.ChemicalEnergyRHS || {}}
              onChangeEafs={(updated) =>
                updateTabData('ChemicalEnergyThreshold', updated)
              }
              onChangeRhs={(updated) =>
                updateTabData('ChemicalEnergyRHS', updated)
              }
            />
          )}

          {activeTab === 'TermYield' && (
            <TabLongTermYield
              data={localSettings?.TermYield || []}
              onChange={(updated) =>
                updateTabData('TermYield', updated)
              }
            />
          )}

          {activeTab === 'Tolerance' && (
            <TabThresholds
              data={localSettings?.Tolerance || {}}
              onChange={(updated) =>
                updateTabData('Tolerance', updated)
              }
            />
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}