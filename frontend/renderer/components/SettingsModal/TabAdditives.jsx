import React from 'react';

export default function TabAdditives({ data = [], onChange }) {
  const additives = data && data.length > 0 ? data[0] : {};

  const handleInputChange = (field, value) => {
    if (!onChange) return;
    const updated = [
      {
        ...additives,
        [field]: value === '' ? '' : Number(value),
      },
    ];
    onChange(updated);
  };

  const sections = [
    {
      title: 'Dolomite',
      fields: ['CaO', 'MgO', 'CO2', 'C', 'SiO2'],
    },
    {
      title: 'Lime',
      fields: ['CaO_2', 'MgO_2', 'CO2_2', 'C_2', 'SiO2_2'],
    },
    {
      title: 'Coke',
      fields: ['Cfix', 'Ash', 'SiO2_in_Ash', 'Volatile_matter', 'S', 'Moisture'],
    },
    {
      title: 'Graphite',
      fields: ['Cfix_2', 'Ash_2', 'SiO2_in_Ash_2', 'Volatile_matter_2', 'S_2', 'Moisture_2'],
    },
  ];

  const getLabel = (field) => {
    const labels = {
      CaO: 'CaO (%)',
      MgO: 'MgO (%)',
      CO2: 'CO₂ (%)',
      C: 'C (%)',
      SiO2: 'SiO₂ (%)',
      CaO_2: 'CaO (%)',
      MgO_2: 'MgO (%)',
      CO2_2: 'CO₂ (%)',
      C_2: 'C (%)',
      SiO2_2: 'SiO₂ (%)',
      Cfix: 'Cfix (%)',
      Ash: 'Ash (%)',
      SiO2_in_Ash: 'SiO₂ in Ash (%)',
      Volatile_matter: 'Volatile Matter (%)',
      S: 'S (%)',
      Moisture: 'Moisture (%)',
      Cfix_2: 'Cfix (%)',
      Ash_2: 'Ash (%)',
      SiO2_in_Ash_2: 'SiO₂ in Ash (%)',
      Volatile_matter_2: 'Volatile Matter (%)',
      S_2: 'S (%)',
      Moisture_2: 'Moisture (%)',
    };
    return labels[field] || field;
  };

  return (
    <div className="w-full overflow-x-auto space-y-6">
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-indigo-100 rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-indigo-100 text-center text-sm">
              <thead className="bg-[#f5f6ff]">
                <tr>
                  <th
                    colSpan={section.fields.length}
                    scope="col"
                    className="py-3 px-3 font-semibold text-[#4338ca] tracking-wide"
                  >
                    {section.title}
                  </th>
                </tr>
                <tr>
                  {section.fields.map((field) => (
                    <th
                      key={field}
                      scope="col"
                      className="py-2 px-2 font-semibold text-[#4338ca] tracking-wide text-xs"
                    >
                      {getLabel(field)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50 bg-white">
                <tr className="hover:bg-indigo-50/30 transition-colors">
                  {section.fields.map((field) => (
                    <td key={field} className="py-1 px-2">
                      <input
                        type="number"
                        step="any"
                        value={additives[field] ?? ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
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
      ))}
    </div>
  );
}
