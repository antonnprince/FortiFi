import React, { useState } from 'react';
import { pinata } from '../utils/config'; // Ensure your Pinata SDK instance is imported
import axios from 'axios';

const NewRules = () => {
  const [ruleType, setRuleType] = useState('');
  const [ruleContent, setRuleContent] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cid, setCid] = useState('');
  const [retrieveCid, setRetrieveCid] = useState('');
  const [retrievedData, setRetrievedData] = useState(null);

  const handleRuleTypeChange = (event) => {
    console.log('Rule type changed to:', event.target.value);
    setRuleType(event.target.value);
    setRuleContent('');
    setGeneratedQuestions([]);
    setError('');
  };

  const handleRuleContentChange = (event) => {
    console.log('Rule content updated:', event.target.value);
    setRuleContent(event.target.value);
  };

  const handleRetrieveCidChange = (event) => {
    console.log('Retrieve CID updated:', event.target.value);
    setRetrieveCid(event.target.value);
  };

  const generateQuestionVariations = async (question) => {
    console.log('Generating question variations for:', question);
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: `Generate 10 different ways to ask the following question: "${question}"` },
    ];

    setLoading(true);
    try {
      const response = await axios.post(
        endpoint,
        { model: 'gpt-4', messages, max_tokens: 150, temperature: 0.7 },
        { headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
      );

      const variations = response.data.choices[0].message.content.split('\n').filter(line => line.trim());
      console.log('Generated question variations:', variations);
      return variations
    } catch (error) {
      console.error('Error generating question variations:', error);
      setError('Failed to generate question variations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const uploadToPinata = async (data) => {
    console.log('Uploading data to Pinata:', data);
    if (!data) {
      setError('No data to upload.');
      return;
    }

    try {
      setLoading(true);
      const response = await pinata.upload.json(data);
      console.log('Upload response from Pinata:', response);
      const uploadedCid = response.IpfsHash; // CID from Pinata
      console.log('Data uploaded successfully. CID:', uploadedCid);
      setCid(uploadedCid);
      return uploadedCid;
    } catch (error) {
      console.error('Error uploading data to Pinata:', error);
      setError('Failed to upload data to Pinata.');
    } finally {
      setLoading(false);
    }
  };

const retrieveFromPinata = async (cid) => {
  console.log('Retrieving data from Pinata for CID:', cid);
  if (!cid) {
    setError('Please provide a CID to retrieve.');
    return;
  }

  try {
    setLoading(true);
    const gatewayUrl = 'https://gateway.pinata.cloud/ipfs';
    const response = await fetch(`${gatewayUrl}/${cid}`);
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Array.from(response.headers.entries()));

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const rawText = await response.text();
      console.error('Unexpected response content:', rawText);
      setError('The retrieved data is not in JSON format. Check the CID or gateway.');
      return;
    }

    const data = await response.json();
    console.log('Data retrieved from Pinata:', data);
    setRetrievedData(data);
  } catch (error) {
    console.error('Error retrieving data from Pinata:', error);
    setError('Failed to retrieve data from Pinata. Ensure the CID and gateway are correct.');
  } finally {
    setLoading(false);
  }
};
  const handleRetrieve = async () => {
    console.log('Handling retrieve for CID:', retrieveCid);
    if (retrieveCid.trim() === '') {
      setError('Please enter a CID to retrieve.');
      return;
    }

    setError('');
    try {
      await retrieveFromPinata(retrieveCid);
    } catch (err) {
      setError('Failed to retrieve data from Pinata.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitting rule:', { ruleType, ruleContent });
    setError('');
    setLoading(true);

    const ruleData = {
      rule_type: ruleType,
      rule: ruleContent,
    };

    try {
      if (ruleType === 'question') {
        console.log('Generating question variations...');
        const variations=await generateQuestionVariations(ruleContent);
        console.log('Adding generated questions to rule data:', variations);
        ruleData.generated_questions = variations;
      }

      console.log('Uploading rule data to Pinata...');
      const ruleCID = await uploadToPinata(ruleData);
      if (ruleCID) {
        console.log('Rule stored with CID:', ruleCID);
        sessionStorage.setItem('uploadedCID', ruleCID);
        setRules([...rules, { ...ruleData, cid: ruleCID }]);
        setRuleType('');
        setRuleContent('');
        setGeneratedQuestions([]);
      }
    } catch (error) {
      console.error('Error storing rule:', error);
      setError('Failed to store rule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Rule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Select Rule Type</label>
          <select
            value={ruleType}
            onChange={handleRuleTypeChange}
            className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            <option value="phrase">Phrase</option>
            <option value="question">Question</option>
            <option value="statement">Statement</option>
          </select>
        </div>

        {ruleType && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {ruleType === 'phrase' ? 'Enter Words/Phrases' : ruleType === 'question' ? 'Enter Question' : 'Enter Statement'}
            </label>
            <input
              type="text"
              value={ruleContent}
              onChange={handleRuleContentChange}
              className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
            disabled={loading || !ruleContent}
          >
            {loading ? 'Loading...' : 'Add Rule'}
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold">Retrieve Data from Pinata</h3>
        <input
          type="text"
          value={retrieveCid}
          onChange={handleRetrieveCidChange}
          placeholder="Enter CID"
          className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleRetrieve}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
        >
          Retrieve
        </button>

        {retrievedData && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h4 className="font-semibold text-lg">Retrieved Data:</h4>
            <pre className="mt-2 text-sm text-gray-800">{JSON.stringify(retrievedData, null, 2)}</pre>
          </div>
        )}
      </div>

      {cid && <p className="mt-4 text-green-600">Data uploaded to Pinata. CID: {cid}</p>}
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </div>
  );
};

export default NewRules;