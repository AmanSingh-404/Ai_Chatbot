const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

async function genrateResponse(chatHistory) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: chatHistory,
  });

  const text = response.candidates[0].content.parts[0].text;

  return text;
}

module.exports = {
  genrateResponse,
};
