import React from 'react';

export default function TabLongTermYield({ data = [], onChange }) {
  const eafRows = data && data.length > 0
    ? data
    : Array.from({ length: 8 }, (_, i) => ({ EAF: i + 1, Yield: '' }));

  const handleCellChange = (index, value) => {
    if (!onChange) return;
    const updated = [...eafRows];
    updated[index] = {
      ...updated[index],
      Yield: value === '' ? '' : Number(value),
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
                <th scope="col" className="py-3 px-4 font-semibold text-[#4338ca] tracking-wide w-32">
                  EAF
                </th>
                <th scope="col" className="py-3 px-4 font-semibold text-[#4338ca] tracking-wide">
                  Yield (%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50 bg-white">
              {eafRows.map((row, rowIndex) => (
                <tr
                  key={row.EAF || rowIndex}
                  className="hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="py-2.5 px-4 font-medium text-slate-700 bg-slate-50/50">
                    {row.EAF || rowIndex + 1}
                  </td>
                  <td className="py-1 px-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="0.0"
                      value={row.Yield ?? ''}
                      onChange={(e) => handleCellChange(rowIndex, e.target.value)}
                      className="w-full text-center py-1.5 px-2 text-slate-800 bg-transparent rounded-lg border border-transparent hover:border-indigo-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-mono text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
