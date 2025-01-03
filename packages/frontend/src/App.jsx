import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RulesDisplay from './components/RulesDisplay';
import NewRules from './components/NewRules';
import Docs from './components/Docs';

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 h-full bg-gray-800 text-white p-6">
          <h1 className="text-2xl font-bold text-center mb-10">FortiFi Panel</h1>
          <ul>
            <li className="mb-4">
              <Link to="/" className="text-gray-300 hover:text-white">Dashboard</Link>
            </li>
            <li className="mb-4">
              <Link to="/add" className="text-gray-300 hover:text-white">Add New Rule</Link>
            </li>
            <li className="mb-4">
              <a href="/docs" className="text-gray-300 hover:text-white">Docs</a>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-50">

          {/* Content Area */}
          <div className="p-6">
            <Routes>
              <Route path="/" element={<RulesDisplay />} />
              <Route path="/add" element={<NewRules />} />
              <Route path="/docs" element={<Docs />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;