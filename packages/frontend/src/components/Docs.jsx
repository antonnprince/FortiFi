import React, { useState } from 'react';

// Pagination component
const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <div className="flex justify-center space-x-2 my-4 bottom-0 right-10 absolute">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-gray-600 text-white' : 'bg-gray-300'}`}
          onClick={() => setCurrentPage(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

const Docs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // Example number of pages

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Code copied to clipboard!');
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-semibold mb-6">Fortifi Package Documentation</h1>

      {/* Page 1 */}
      {currentPage === 1 && (
        <section className="mb-6">
          <h2 className="text-3xl font-semibold">What is Pinata & CID?</h2>
          <p className="text-lg">
            <strong>Pinata</strong> is a service that allows you to manage and pin content to the IPFS network. IPFS (InterPlanetary File System) is a protocol and peer-to-peer network for storing and sharing data in a distributed file system.
          </p>
          <p className="text-lg mt-4">
            <strong>CID (Content Identifier)</strong> is a unique identifier for a piece of content stored on IPFS. Every file or set of files uploaded to IPFS is assigned a CID that acts as a permanent address for that content, which can be accessed through Pinata or any IPFS gateway.
          </p>
        </section>
      )}

      {/* Page 2 */}
      {currentPage === 2 && (
        <section className="mb-6">
          <h2 className="text-3xl font-semibold">Installation</h2>
          <p className="text-lg mb-4">
            To install the Fortifi package, simply run the following command in your terminal:
          </p>
          <pre className="bg-gray-800 text-white p-4 rounded-lg">
            <code>
              npm install fortifi@1.0.2
            </code>
          </pre>
          <button
            className="mt-2 bg-gray-600 text-white px-4 py-2 rounded"
            onClick={() => handleCopy('npm install fortifi')}
          >
            Copy Code
          </button>
        </section>
      )}

      {/* Page 3 */}
      {currentPage === 3 && (
        <section className="mb-6">
          <h2 className="text-3xl font-semibold">Usage</h2>
          <p className="text-lg mb-4">
            After installation, you can use the Fortifi middleware in your Express.js application to prevent restricted financial questions. Here's an example of how to use it:
          </p>
          
          <pre className="bg-gray-800 text-white p-4 rounded-lg">
            <code>
              {`
const express = require('express');
const fortiFi = require('fortifi');

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Apply the financial guardrail middleware
app.post('/ask', fortiFi, (req, res) => {
  res.send("Your question is being processed.");
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
`}
            </code>
          </pre>
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => handleCopy(`
const express = require('express');
const fortiFi = require('fortifi');

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Apply the financial guardrail middleware
app.post('/ask', fortiFi, (req, res) => {
  res.send("Your question is being processed.");
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}`)
          }>
            Copy Code
          </button>
        </section>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
    </div>
  );
};

export default Docs;