import React, { useEffect, useState } from 'react';

const RulesDisplay = () => {
  const [cid, setCid] = useState(null); // State to store the CID retrieved from session storage
  const [pinataData, setPinataData] = useState(null); // State to store the content fetched from Pinata
  const [loading, setLoading] = useState(false); // State to track the loading status
  const [error, setError] = useState(null); // State to track any error during the fetch

  useEffect(() => {
    const storedCid = sessionStorage.getItem('uploadedCID');
    if (storedCid) {
      setCid(storedCid); // Set the CID in state if it exists
    }
  }, []);

  useEffect(() => {
    if (cid) {
      // Fetch the content from Pinata when CID is available
      const fetchPinataData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
          if (response.ok) {
            const data = await response.json(); // Assuming the CID points to JSON data
            setPinataData(data);
          } else {
            throw new Error('Failed to fetch data from Pinata');
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPinataData();
    }
  }, [cid]);

  return (
    <div className="flex-1 bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Rules Data</h2>
      
      {cid && (
        <p className="text-green-600 mb-4">Retrieved CID from session: {cid}</p>
      )}

      {loading && <p className="text-blue-600 mb-4">Loading data from Pinata...</p>}
      {error && <p className="text-red-600 mb-4">Error: {error}</p>}

      {pinataData && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Key</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pinataData).length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-4 py-2 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                Object.entries(pinataData).map(([key, value], index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{key}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {typeof value === 'object' ? (
                        <pre className="bg-gray-100 p-2 rounded-lg text-sm">{JSON.stringify(value, null, 2)}</pre>
                      ) : (
                        value
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RulesDisplay;