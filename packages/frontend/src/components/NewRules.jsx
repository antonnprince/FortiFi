import React, { useState } from 'react';
import axios from 'axios';
import { create } from 'ipfs-http-client';

// Initialize IPFS client
const ipfsClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

const NewRules = () => {
  const [ruleType, setRuleType] = useState('');
  const [ruleContent, setRuleContent] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(''); // Track errors
  const [cid, setCid] = useState(''); // CID from IPFS

  const handleRuleTypeChange = (event) => {
    setRuleType(event.target.value);
    setRuleContent('');
    setError('');
  };

  const handleRuleContentChange = (event) => {
    setRuleContent(event.target.value);
  };

  const generateQuestionVariations = async (question) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: `Generate 10 different ways to ask the following question: "${question}"` },
    ];

    setLoading(true);

    try {
      const response = await axios.post(
        endpoint,
        { model: 'gpt-4', messages, max_tokens: 150, temperature: 0.7 },
        { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
      );

      const variations = response.data.choices[0].message.content.split('\n').filter((line) => line.trim());
      setGeneratedQuestions(variations);
    } catch (error) {
      setError('Failed to generate question variations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setCid('');

    const ruleData = {
      rule_type: ruleType,
      rule: ruleContent,
      rule_variations: ruleType === 'question' ? generatedQuestions : [],
    };

    try {
      setLoading(true);

      // Upload JSON object to IPFS
      const { path } = await ipfsClient.add(JSON.stringify(ruleData));

      setCid(path); // Set CID
      setRules([...rules, ruleData]); // Update local rules list
    } catch (error) {
      setError('Failed to upload rule to IPFS. Please try again.');
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
              placeholder={ruleType === 'phrase' ? 'e.g. dumb, stupid' : ruleType === 'question' ? 'e.g. Is this a question?' : 'e.g. This is a statement.'}
              className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {ruleType === 'question' && generatedQuestions.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Generated Question Variations</h3>
            <ul className="list-disc pl-6 space-y-2">
              {generatedQuestions.map((question, index) => (
                <li key={index} className="text-sm text-gray-600">{question}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700"
          disabled={loading || !ruleContent}
        >
          {loading ? 'Loading...' : 'Add Rule'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      {cid && <p className="mt-4 text-green-600 text-center">Rule saved! CID: {cid}</p>}

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">All Rules</h3>
        <ul className="space-y-2">
          {rules.map((rule, index) => (
            <li key={index} className="border-b">
              <div className="font-semibold">{rule.rule_type.toUpperCase()}</div>
              <div className="text-sm">{rule.rule}</div>
              {rule.rule_variations.length > 0 && (
                <ul className="list-disc pl-6">
                  {rule.rule_variations.map((variation, idx) => (
                    <li key={idx} className="text-sm text-gray-600">{variation}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewRules;