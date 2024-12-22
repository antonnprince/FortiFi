import React, { useState } from 'react';
import { pinata } from '../utils/config'; // Ensure your config is set up as per the earlier steps

const IPFSDagCborHandler = () => {
  const [jsonData, setJsonData] = useState('');
  const [cid, setCid] = useState('');
  const [retrievedData, setRetrievedData] = useState(null);
  const [error, setError] = useState(null);

  const handleAddJson = async () => {
    setError(null);
    setRetrievedData(null);

    if (!jsonData.trim()) {
      setError('Please provide valid JSON data.');
      return;
    }

    try {
      // Parse the JSON data
      const parsedJson = JSON.parse(jsonData);

      // Add JSON to IPFS via Pinata
      const added = await pinata.upload.json(parsedJson);

      console.log('Added JSON to IPFS with CID:', added.IpfsHash);
      setCid(added.IpfsHash);
    } catch (err) {
      console.error('Error adding JSON to IPFS:', err);
      setError('Failed to add JSON to IPFS. Ensure it is valid.');
    }
  };

  const handleRetrieveJson = async () => {
    setError(null);

    if (!cid.trim()) {
      setError('Please provide a valid CID.');
      return;
    }

    try {
      // Use Pinata gateway to retrieve the data
      const ipfsUrl = await pinata.gateways.convert(cid.trim());
      const response = await fetch(ipfsUrl);
      const data = await response.json();

      console.log('Retrieved data from IPFS:', data);
      setRetrievedData(data);
    } catch (err) {
      console.error('Error retrieving JSON from IPFS:', err);
      setError('Failed to retrieve JSON from IPFS. Ensure CID is correct.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">IPFS JSON Handler with Pinata</h1>

      {/* Add JSON Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add JSON to IPFS</h2>
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder="Enter JSON data here"
          rows="6"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleAddJson}
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Add JSON
        </button>
        {cid && (
          <p className="mt-4 text-green-600">
            JSON added to IPFS. CID: <span className="font-mono">{cid}</span>
          </p>
        )}
      </div>

      {/* Retrieve JSON Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Retrieve JSON from IPFS</h2>
        <input
          type="text"
          value={cid}
          onChange={(e) => setCid(e.target.value)}
          placeholder="Enter CID here"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleRetrieveJson}
          className="bg-green-600 text-white py-2 px-4 rounded"
        >
          Retrieve JSON
        </button>
        {retrievedData && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h3 className="text-lg font-semibold">Retrieved Data:</h3>
            <pre className="mt-2 text-sm">{JSON.stringify(retrievedData, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Error Handling */}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default IPFSDagCborHandler;