import React from 'react';

export default function TabWaterCooling({ data = [], onChange }) {
  const columns = [
    { key: 'EAF', label: 'EAF', editable: false },
    { key: 'TinRoof', label: 'T in roof', editable: true },
    { key: 'TinShell', label: 'T in shell', editable: true },
    { key: 'TOutRoof', label: 'T out roof', editable: true },
    { key: 'TOutShell', label: 'T out shell', editable: true },
    { key: 'RooDebit', label: 'roof debit', editable: true },
    { key: 'ShellDebit', label: 'shell debit', editable: true },
  ];

  const handleCellChange = (rowIndex, field, value) => {
    if (!onChange) return;
    const updated = [...data];
    updated[rowIndex] = {
      ...updated[rowIndex],
      [field]: value,
    };
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
              {data.map((row, rowIndex) => (
                <tr
                  key={row.EAF || rowIndex}
                  className="hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium text-slate-700 bg-slate-50/50">
                    {row.EAF || rowIndex + 1}
                  </td>
                  {columns.slice(1).map((col) => (
                    <td key={col.key} className="py-1 px-2">
                      <input
                        type="text"
                        value={row[col.key] ?? ''}
                        onChange={(e) =>
                          handleCellChange(rowIndex, col.key, e.target.value)
                        }
                        placeholder="0.0"
                        className="w-full text-center py-1.5 px-2 text-slate-800 bg-transparent rounded-lg border border-transparent hover:border-indigo-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-mono text-sm"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}