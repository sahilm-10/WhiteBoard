const express = require("express"); // Access
const socket = require("socket.io");

const app = express(); // Initialize and server ready

app.use(express.static("public"));  // public -> static file display karega on localhost:port
// Listening to the server
let port = 3000;
let server = app.listen(port,()=>{
    console.log("Listening to port:" + port);
});

let io = socket(server);

io.on("connection",(socket)=>{
    console.log("Made socket connection");

    // Received Data
    socket.on("beginPath",(data)=>{
        // Transfer data to all clients
        // data from frontend
        io.sockets.emit("beginPath",data); //can perform changes 
    })

    socket.on("drawStroke",(data)=>{
        io.sockets.emit("drawStroke",data);
    })

    socket.on("redoUndo",(data)=>{
        io.sockets.emit("redoUndo",data);
    })
})


