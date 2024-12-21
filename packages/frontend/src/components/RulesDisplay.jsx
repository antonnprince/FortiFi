import React from 'react';

const RulesDisplay = () => {
  // Define the rules within the component itself
  const rules = [
    { name: 'No toxic language' },
    { name: 'No personal data sharing' },
    { name: 'Respect all users' },
    { name: 'No spamming' },
    { name: 'Follow community guidelines' },
  ];

  return (
    <div className="flex-1 bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Rules List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Rule Name</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 ? (
              <tr>
                <td colSpan="1" className="px-4 py-2 text-center text-gray-500">No rules available</td>
              </tr>
            ) : (
              rules.map((rule, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{rule.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RulesDisplay;