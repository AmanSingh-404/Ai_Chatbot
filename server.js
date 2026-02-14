require("dotenv").config();
const app = require("./src/app")
const { createServer } = require("http");
const { Server } = require("socket.io");
const {genrateResponse} = require("./src/services/ai.services")

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  console.log("A User Connected")

  socket.on("disconnect",(socket)=>{
    console.log("user Disconnected");
  })

  socket.on("ai-message", async (data)=>{
    console.log("user-message", data);
    const response = await genrateResponse(data.prompt);
    console.log("ai-response", response)
    socket.emit("ai-message-response", {response})
  })
});


httpServer.listen(3000, ()=>{
    console.log("server running on port 3000");
})