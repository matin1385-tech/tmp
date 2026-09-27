import React from 'react';

export default function TabThresholds({ data = {}, onChange }) {
  const thresholds = data || {
    APEFE: '',
    APEEN: '',
    Yield: '',
  };

  const handleChange = (field, value) => {
    if (!onChange) return;
    onChange({
      ...thresholds,
      [field]: value === '' ? '' : Number(value),
    });
  };

  const items = [
    { key: 'APEFE', label: 'APE(FE)' },
    { key: 'APEEN', label: 'APE(Energy)' },
    { key: 'Yield', label: 'Yield Tolerance' },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-indigo-100 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-indigo-100 text-center text-sm">
            <thead className="bg-[#f5f6ff]">
              <tr>
                {items.map((item) => (
                  <th
                    key={item.key}
                    scope="col"
                    className="py-3 px-3 font-semibold text-[#4338ca] tracking-wide"
                  >
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50 bg-white">
              <tr className="hover:bg-indigo-50/30 transition-colors">
                {items.map((item) => (
                  <td key={item.key} className="py-1 px-2">
                    <input
                      type="number"
                      step="any"
                      value={thresholds[item.key] ?? ''}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      placeholder="0.0"
                      className="w-full text-center py-1.5 px-2 text-slate-800 bg-transparent rounded-lg border border-transparent hover:border-indigo-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-mono text-sm"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
