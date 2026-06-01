const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("User Connected");

    socket.on("join", ({ user }) => {
        socket.data.username = user;
        io.emit("system message", `${user} joined the chat`);
    });

    socket.on("chat message", (msg) => {
        io.emit("chat message", { ...msg, senderId: socket.id });
    });

    socket.on("disconnect", () => {
        if (socket.data.username) {
            io.emit("system message", `${socket.data.username} left the chat`);
        }
        console.log("User Disconnected");
    });
});

const PORT = 5001;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
