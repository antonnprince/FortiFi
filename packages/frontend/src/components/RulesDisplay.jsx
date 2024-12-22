import React, { useEffect, useState } from 'react';

const RulesDisplay = () => {
  const [cid, setCid] = useState(null); // State to store the CID retrieved from session storage

  useEffect(() => {
    // Retrieve the CID from session storage
    const storedCid = sessionStorage.getItem('uploadedCID');
    if (storedCid) {
      setCid(storedCid); // Set the CID in state if it exists
    }
  }, []);

  const rules = [
    { ruleType: 'question', rule: 'Should I buy Apple stocks?', generatedQuestions: [] },
    { ruleType: 'phrase', rule: 'No toxic language', generatedQuestions: [] },
    { ruleType: 'statement', rule: 'Respect all users', generatedQuestions: [] },
    { ruleType: 'question', rule: 'Is React a good library for frontend development?', generatedQuestions: [] },
    { ruleType: 'statement', rule: 'Follow community guidelines', generatedQuestions: [] },
  ];

  return (
    <div className="flex-1 bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Rules List</h2>
      {cid && (
        <p className="text-green-600 mb-4">Retrieved CID from session: {cid}</p>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Rule Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Rule</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Generated Questions</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                  No rules available
                </td>
              </tr>
            ) : (
              rules.map((rule, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{rule.ruleType}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{rule.rule}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {rule.generatedQuestions.length > 0 ? (
                      <ul className="list-disc pl-6">
                        {rule.generatedQuestions.map((question, i) => (
                          <li key={i}>{question}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>No generated questions</span>
                    )}
                  </td>
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