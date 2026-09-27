import React from 'react';

export default function TabDustAnalysis({ data = [], onChange }) {
  const columns = [
    { key: 'Al2O3', label: 'Al2O3' },
    { key: 'C', label: 'C' },
    { key: 'CaO', label: 'CaO' },
    { key: 'FeO', label: 'FeO' },
    { key: 'Fem', label: 'Fem' },
    { key: 'MgO', label: 'MgO' },
    { key: 'P', label: 'P' },
    { key: 'S', label: 'S' },
    { key: 'SiO2', label: 'SiO2' },
    { key: 'TiO2', label: 'TiO2' },
  ];

  const row = data[0] || {};

  const handleCellChange = (field, value) => {
    if (!onChange) return;
    const updated = [
      {
        ...row,
        [field]: value === '' ? '' : Number(value),
      },
    ];
    onChange(updated);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-indigo-100 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-indigo-100 text-center text-sm">
            <thead className="bg-[#f5f6ff]">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="py-3 px-3 font-semibold text-[#4338ca] tracking-wide"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50 bg-white">
              <tr className="hover:bg-indigo-50/30 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="py-1 px-2">
                    <input
                      type="number"
                      step="any"
                      value={row[col.key] ?? ''}
                      onChange={(e) =>
                        handleCellChange(col.key, e.target.value)
                      }
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
