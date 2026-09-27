import React from 'react';

export default function TabChemicalEnergy({ data = [], rhs = {}, onChangeEafs, onChangeRhs }) {
  const eafs = data && Array.isArray(data) ? data : Array.from({ length: 8 }, (_, i) => ({
    EAF: i + 1,
    FirstThreshold: '',
    SecondThreshold: '',
    ThirdThreshold: '',
  }));

  const rhsData = rhs || {
    LtFirstThreshold: '',
    LtSecondThreshold: '',
    LtThirdThreshold: '',
    GtThirdThreshold: '',
  };

  const handleRhsCellChange = (field, value) => {
    if (!onChangeRhs) return;
    onChangeRhs({
      ...rhsData,
      [field]: value === '' ? '' : Number(value),
    });
  };

  const handleEafCellChange = (index, field, value) => {
    if (!onChangeEafs) return;
    const updatedEafs = [...eafs];
    updatedEafs[index] = {
      ...updatedEafs[index],
      [field]: value === '' ? '' : Number(value),
    };
    onChangeEafs(updatedEafs);
  };

  return (
    <div className="w-full overflow-x-auto space-y-6">
      {/* RHS Section */}
      <div className="inline-block min-w-full align-middle">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
          {[
            { key: 'LtFirstThreshold', label: 'X < First Threshold' },
            { key: 'LtSecondThreshold', label: 'First Threshold < X < Second Threshold' },
            { key: 'LtThirdThreshold', label: 'Second Threshold < X < Third Threshold' },
            { key: 'GtThirdThreshold', label: 'Third Threshold < X' },
          ].map((item) => (
            <div
              key={item.key}
              className="flex flex-col border-r border-indigo-100 last:border-r-0 bg-[#f5f6ff] p-4 hover:bg-indigo-100/50 transition-all"
            >
              <label className="text-xs font-semibold text-[#4338ca] mb-2 uppercase tracking-tight">
                {item.label}
              </label>
              <input
                type="number"
                step="any"
                value={rhsData[item.key] ?? ''}
                onChange={(e) => handleRhsCellChange(item.key, e.target.value)}
                placeholder="0.0"
                className="w-full px-2.5 py-2 bg-white border border-transparent rounded text-sm text-center font-mono text-slate-800 hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      {/* EAF Table */}
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-indigo-100 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-indigo-100 text-center text-sm">
            <thead className="bg-[#f5f6ff]">
              <tr>
                <th scope="col" className="py-3 px-3 font-semibold text-[#4338ca] tracking-wide">
                  EAF
                </th>
                <th scope="col" className="py-3 px-3 font-semibold text-[#4338ca] tracking-wide">
                  First Threshold
                </th>
                <th scope="col" className="py-3 px-3 font-semibold text-[#4338ca] tracking-wide">
                  Second Threshold
                </th>
                <th scope="col" className="py-3 px-3 font-semibold text-[#4338ca] tracking-wide">
                  Third Threshold
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50 bg-white">
              {eafs.map((row, rowIndex) => (
                <tr
                  key={row.EAF || rowIndex}
                  className="hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium text-slate-700 bg-slate-50/50">
                    {row.EAF || rowIndex + 1}
                  </td>
                  <td className="py-1 px-2">
                    <input
                      type="number"
                      step="any"
                      value={row.FirstThreshold ?? ''}
                      onChange={(e) =>
                        handleEafCellChange(rowIndex, 'FirstThreshold', e.target.value)
                      }
                      placeholder="0.0"
                      className="w-full text-center py-1.5 px-2 text-slate-800 bg-transparent rounded-lg border border-transparent hover:border-indigo-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-mono text-sm"
                    />
                  </td>
                  <td className="py-1 px-2">
                    <input
                      type="number"
                      step="any"
                      value={row.SecondThreshold ?? ''}
                      onChange={(e) =>
                        handleEafCellChange(rowIndex, 'SecondThreshold', e.target.value)
                      }
                      placeholder="0.0"
                      className="w-full text-center py-1.5 px-2 text-slate-800 bg-transparent rounded-lg border border-transparent hover:border-indigo-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-mono text-sm"
                    />
                  </td>
                  <td className="py-1 px-2">
                    <input
                      type="number"
                      step="any"
                      value={row.ThirdThreshold ?? ''}
                      onChange={(e) =>
                        handleEafCellChange(rowIndex, 'ThirdThreshold', e.target.value)
                      }
                      placeholder="0.0"
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
