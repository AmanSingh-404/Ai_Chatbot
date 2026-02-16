require("dotenv").config();
const app = require("./src/app")
const { createServer } = require("http");
const { Server } = require("socket.io");
const { genrateResponse } = require("./src/services/ai.services");
const { text } = require("stream/consumers");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
  }
});

const chatHistory = [
  {
    role: 'user',
    parts: [{ text: 'Turn the lights down to a romantic level' }]
  },
  {
    role: "model",
    parts: [
      {
        text: "welcome to the smart home"
      }
    ]
  }
]

io.on("connection", (socket) => {
  console.log("A User Connected")

  socket.on("disconnect", (socket) => {
    console.log("user Disconnected");
  })

  socket.on("ai-message", async (data) => {
    console.log("user-message", data);

    chatHistory.push({
      role: "user",
      parts: [{ text: data.prompt }]
    })

    const response = await genrateResponse(chatHistory);
    console.log("ai-response", response)
    socket.emit("ai-message-response", { response })
  })
});


const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
})