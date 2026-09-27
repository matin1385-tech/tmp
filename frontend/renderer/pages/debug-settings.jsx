import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export default function DebugSettings() {
  const appContext = useApp();
  const [debugText, setDebugText] = useState('Loading...');

  useEffect(() => {
    console.log('Debug page mounted, appContext:', appContext);
    if (appContext && appContext.settingsData) {
      setDebugText(JSON.stringify({
        loaded: appContext.settingsLoaded,
        keys: Object.keys(appContext.settingsData),
        waterCooling: appContext.settingsData.waterCooling?.slice(0, 2),
      }, null, 2));
    } else {
      setDebugText('AppContext not ready');
    }
  }, [appContext]);

  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-5">Settings Debug</h1>
      <pre className="bg-slate-100 p-5 rounded text-sm overflow-auto max-h-96 border-2 border-slate-200">
        {debugText}
      </pre>
    </div>
  );
}
