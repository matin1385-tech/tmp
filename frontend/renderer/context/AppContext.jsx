import React, { createContext, useContext, useState, useEffect } from 'react';
import { API } from '../config/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [files, setFiles] = useState({
    'DRI Analysis.xlsx': null,
    'Melt Analysis.xlsx': null,
    'Melt Operation.xlsx': null,
    'Slag Analysis.xlsx': null,
  });

  const [isSettingsSaved, setIsSettingsSaved] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Populated after the files are uploaded (window 1 -> window 2)
  const [fileId, setFileId] = useState(null);

  // Populated once the optimization job finishes (window 3 -> window 4)
  const [jobId, setJobId] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [resultTotal, setResultTotal] = useState(0);
  // The 7-tab settings object as echoed back by the backend for this run
  // (see summary.settings in /api/status and /api/results/<job_id>.json)
  const [resultSettings, setResultSettings] = useState(null);

  const [settingsData, setSettingsData] = useState({
    WaterCooling: Array.from({ length: 8 }, (_, i) => ({
      EAF: i + 1,
      TinRoof: '',
      TinShell: '',
      TOutRoof: '',
      TOutShell: '',
      RooDebit: '',
      ShellDebit: '',
    })),

    DustAnalysis: [
      {
        Al2O3: '',
        C: '',
        CaO: '',
        FeO: '',
        Fem: '',
        MgO: '',
        P: '',
        S: '',
        SiO2: '',
        TiO2: '',
      },
    ],

    Additives: [
      {
        CaO: 0,
        MgO: 0,
        CO2: 0,
        C: 0,
        SiO2: 0,
        CaO_2: 0,
        MgO_2: 0,
        CO2_2: 0,
        C_2: 0,
        SiO2_2: 0,
        Cfix: 0,
        Ash: 0,
        SiO2_in_Ash: 0,
        Volatile_matter: 0,
        S: 0,
        Moisture: 0,
        Cfix_2: 0,
        Ash_2: 0,
        SiO2_in_Ash_2: 0,
        Volatile_matter_2: 0,
        S_2: 0,
        Moisture_2: 0,
      },
    ],

    GradeSpecification: [],

    ChemicalEnergyThreshold: Array.from({ length: 8 }, (_, i) => ({
      EAF: i + 1,
      FirstThreshold: '',
      SecondThreshold: '',
      ThirdThreshold: '',
    })),

    ChemicalEnergyRHS: {
      LtFirstThreshold: 0.25,
      LtSecondThreshold: 0.5,
      LtThirdThreshold: 0.75,
      GtThirdThreshold: 1.25,
    },

    TermYield: Array.from({ length: 8 }, (_, i) => ({
      EAF: i + 1,
      Yield: '',
    })),

    Tolerance: {
      APEFE: '',
      APEEN: '',
      Yield: '',
    },
  });

  // Load default settings from frontend data on mount, then check localStorage for saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        console.log('AppContext: Loading settings from frontend data...');
        // Import settings from frontend data folder
        const defaultSettings = await import('../data/settings.json').then(mod => mod.default);
        console.log('AppContext: Default settings loaded:', defaultSettings);
        
        // Check if user has saved settings in localStorage
        const savedSettings = localStorage.getItem('eea_settings');
        if (savedSettings) {
          try {
            const parsedSettings = JSON.parse(savedSettings);
            console.log('AppContext: Using saved settings from localStorage:', parsedSettings);
            setSettingsData(parsedSettings);
          } catch (e) {
            console.log('AppContext: Invalid localStorage settings, using defaults');
            setSettingsData(defaultSettings);
          }
        } else {
          console.log('AppContext: No saved settings found, using defaults');
          setSettingsData(defaultSettings);
        }
        
        setSettingsLoaded(true);
      } catch (error) {
        console.error('AppContext: Error loading settings:', error);
        setSettingsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  const setFileByName = (fileName, fileObj) => {
    setFiles((prev) => ({
      ...prev,
      [fileName]: fileObj,
    }));
  };

  const canProceedToRange = () => {
    const allFilesUploaded = Object.values(files).every(
      (f) => f !== null
    );

    return allFilesUploaded && isSettingsSaved;
  };

  return (
    <AppContext.Provider
      value={{
        files,
        setFiles,
        setFileByName,

        isSettingsSaved,
        setIsSettingsSaved,
        settingsLoaded,

        fileId,
        setFileId,

        jobId,
        setJobId,

        resultData,
        setResultData,

        resultTotal,
        setResultTotal,

        resultSettings,
        setResultSettings,

        settingsData,
        setSettingsData,

        canProceedToRange,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};