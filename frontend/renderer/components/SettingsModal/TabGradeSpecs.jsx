import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function TabGradeSpecs({ data = [], onChange }) {
  const handleCellChange = (id, field, value) => {
    if (!onChange) return;
    const updated = data.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    onChange(updated);
  };

  const handleAddRow = () => {
    if (!onChange) return;
    const newId = data.length > 0 ? Math.max(...data.map((r) => r.id || 0)) + 1 : 1;
    const newRow = {
      id: newId,
      GradeType: '',
      CPercent: '',
      Temperature: '',
    };
    onChange([...data, newRow]);
  };

  const handleDeleteRow = (id) => {
    if (!onChange) return;
    onChange(data.filter((row) => row.id !== id));
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={handleAddRow}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Grade</span>
        </button>
      </div>

      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-indigo-100 rounded-xl shadow-sm">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#f5f6ff] border-b border-indigo-100">
                <th className="py-3 px-4 font-semibold text-[#4338ca] tracking-wide">#</th>
                <th className="py-3 px-4 font-semibold text-[#4338ca] tracking-wide">Grade</th>
                <th className="py-3 px-4 font-semibold text-[#4338ca] tracking-wide">%C</th>
                <th className="py-3 px-4 font-semibold text-[#4338ca] tracking-wide">Temp (°C)</th>
                <th className="py-3 px-4 font-semibold text-[#4338ca] tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50 bg-white">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                    No grade specifications added yet.
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr key={row.id || index} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-slate-700">
                      {index + 1}
                    </td>
                    <td className="py-1 px-2">
                      <input
                        type="text"
                        value={row.GradeType ?? ''}
                        onChange={(e) => handleCellChange(row.id, 'GradeType', e.target.value)}
                        placeholder="5SP"
                        className="w-full text-center py-1.5 px-2 text-slate-800 bg-transparent rounded-lg border border-transparent hover:border-indigo-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-mono text-sm"
                      />
                    </td>
                    <td className="py-1 px-2">
                      <input
                        type="number"
                        step="any"
                        value={row.CPercent ?? ''}
                        onChange={(e) => handleCellChange(row.id, 'CPercent', e.target.value)}
                        placeholder="0.32"
                        className="w-full text-center py-1.5 px-2 text-slate-800 bg-transparent rounded-lg border border-transparent hover:border-indigo-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-mono text-sm"
                      />
                    </td>
                    <td className="py-1 px-2">
                      <input
                        type="number"
                        step="any"
                        value={row.Temperature ?? ''}
                        onChange={(e) => handleCellChange(row.id, 'Temperature', e.target.value)}
                        placeholder="1650"
                        className="w-full text-center py-1.5 px-2 text-slate-800 bg-transparent rounded-lg border border-transparent hover:border-indigo-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-mono text-sm"
                      />
                    </td>
                    <td className="py-1 px-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
