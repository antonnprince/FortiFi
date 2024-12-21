import React, { useState } from 'react';
import axios from 'axios';

const NewRules = () => {
  const [ruleType, setRuleType] = useState('');
  const [ruleContent, setRuleContent] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(''); // Track errors

  const handleRuleTypeChange = (event) => {
    setRuleType(event.target.value);
    setRuleContent('');
    setError(''); // Reset error when changing rule type
  };

  const handleRuleContentChange = (event) => {
    setRuleContent(event.target.value);
  };

  const generateQuestionVariations = async (question) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: `Generate 10 different ways to ask the following question: "${question}"` },
    ];

    setLoading(true); // Set loading state to true while waiting for the response

    try {
      const response = await axios.post(
        endpoint,
        { model: 'gpt-4', messages, max_tokens: 150, temperature: 0.7 },
        { headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
      );

      const variations = response.data.choices[0].message.content.split('\n').filter(line => line.trim());
      setGeneratedQuestions(variations);
    } catch (error) {
      setError('Failed to generate question variations. Please try again.');
    } finally {
      setLoading(false); // Reset loading state after request
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (ruleType === 'question' && ruleContent) {
      generateQuestionVariations(ruleContent);
    } else {
      const newRule = {
        rule_type: ruleType,
        rule: ruleContent,
        rule_variations: []
      };
      setRules([...rules, newRule]);
    }
  };

  const storeGeneratedQuestions = () => {
    const newRule = {
      rule_type: 'question',
      rule: ruleContent,
      rule_variations: generatedQuestions
    };
    setRules([...rules, newRule]);
  };

  return (
    <div className="flex-1 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Rule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rule Type Selection */}
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

        {/* Rule Content Field based on the rule type */}
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

        {/* Show generated question variations if the rule type is "question" */}
        {ruleType === 'question' && generatedQuestions.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Generated Question Variations</h3>
            <ul className="list-disc pl-6 space-y-2">
              {generatedQuestions.map((question, index) => (
                <li key={index} className="text-sm text-gray-600">{question}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={storeGeneratedQuestions}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-800 mt-4"
            >
              Save Rule
            </button>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700"
            disabled={loading || !ruleContent}
          >
            {loading ? 'Loading...' : 'Add Rule'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

      {/* Display all rules */}
      <div className="mt-8">
        <ul className="space-y-2">
          {rules.map((rule, index) => (
            <li key={index} className="border-b">
              <div className="font-semibold">{rule.rule_type.toUpperCase()}</div>
              <div className="text-sm">{rule.rule}</div>
              {rule.rule_variations && rule.rule_variations.length > 0 && (
                <div className="mt-2">
                  <strong>Variations:</strong>
                  <ul className="pl-6 space-y-2">
                    {rule.rule_variations.map((variation, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{variation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewRules;