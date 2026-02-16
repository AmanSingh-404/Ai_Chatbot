require("dotenv").config();

const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { genrateResponse } = require("./src/services/ai.services");

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Each user gets their own chat history
  const chatHistory = [
    {
      role: "user",
      parts: [
        {
          text: "You are a helpful AI chatbot. Answer questions clearly and naturally."
        }
      ]
    }
  ];

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });

  socket.on("ai-message", async (data) => {
    try {
      if (!data?.prompt) {
        return socket.emit("ai-message-response", {
          response: "Invalid message."
        });
      }

      console.log("📩 User:", data.prompt);

      // Add user message
      chatHistory.push({
        role: "user",
        parts: [{ text: data.prompt }]
      });

      // Generate AI response
      const response = await genrateResponse(chatHistory);

      // Add AI response to history
      chatHistory.push({
        role: "model",
        parts: [{ text: response }]
      });

      console.log("🤖 AI:", response);

      socket.emit("ai-message-response", { response });

    } catch (error) {
      console.error("🚨 AI Error:", error);

      socket.emit("ai-message-response", {
        response: "Something went wrong. Please try again."
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
