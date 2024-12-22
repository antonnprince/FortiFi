const axios = require('axios');

// Predefined fallback restricted questions
const defaultRestrictedQuestions = [
  "Should I invest in this stock today?",
  "What stock should I buy right now?",
  "Can you predict the stock market?",
  "Can you give me insider trading information?",
  "How much tax will I owe this year?",
  "How do I file my taxes?",
  "Should I invest in cryptocurrency?"
];

// Function to retrieve the rules from Pinata using the CID
async function getRulesFromPinata(cid) {
  const pinataUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

  console.log(`Attempting to retrieve rules from Pinata: ${pinataUrl}`); // Debug log

  try {
    const response = await axios.get(pinataUrl);
    if (response.status === 200) {
      console.log("Rules successfully retrieved from Pinata:", response.data); // Debug log
      return response.data; // Return the rules JSON
    }
  } catch (error) {
    console.error("Error retrieving data from Pinata:", error); // Debug log
    throw new Error("Failed to retrieve rules from Pinata");
  }
}

async function fortiFiMiddleware(req, res, next) {
  const { ruleType, rule, cid } = req.body;

  console.log("Incoming request body:", req.body); // Debug log

  if (!cid) {
    console.warn("CID is missing in the request."); // Debug log
    return res.status(400).json({ message: "CID is required" });
  }

  try {
    console.log("Fetching rules from Pinata using CID:", cid); // Debug log
    const rules = await getRulesFromPinata(cid);

    const restrictedQuestions = rules.restrictedQuestions || defaultRestrictedQuestions;
    console.log("Restricted questions to check:", restrictedQuestions); // Debug log

    if (ruleType === 'question') {
      console.log(`Analyzing question: "${rule}"`); // Debug log

      // Simplified string matching for debugging
      const isRestricted = restrictedQuestions.some((q) => rule.includes(q));
      console.log(`Is the question restricted? ${isRestricted}`); // Debug log

      if (isRestricted) {
        console.warn("Question is restricted. Sending response to user."); // Debug log
        return res.status(400).json({
          message: "Sorry, I can't answer that.",
        });
      }
    }

    console.log("Question passed the checks. Proceeding to the next middleware."); // Debug log
    next();
  } catch (error) {
    console.error("Error processing the request:", error); // Debug log
    res.status(500).json({ message: error.message });
  }
}

module.exports = fortiFiMiddleware;