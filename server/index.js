const express=require("express")
const { Server } = require("socket.io");
const connetDatabase=require("./config/db")
const dotenv=require("dotenv").config();
const userRoutes=require("./routes/userRoutes")
const app=express()
const cors=require("cors")
const os = require('os'); 
const axios = require('axios');
const User=require("./models/userModel")


connetDatabase()
app.use(cors({origin:process.env.FRONTEND_URL}))
app.use(express.json())
app.use("/api/use",userRoutes)

 app.get("/",(req,res)=>{ 
  res.send("server is running")
 })
 
 const server = app.listen(8000, async () => {
   console.log("server is connected")
}); 



const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin:process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  },
});

const emailToSocketIdMap = new Map();  
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);
  io.emit("socket:id",socket.id)

  socket.on("room:join", async(data) => {
    const { email, roomId} = data;
    console.log(email,roomId,socket.id)
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email); 
    io.to(roomId).emit("user:joined", { email, id: socket.id}); 
    socket.join(roomId);
    io.to(socket.id).emit("room:join", data); 
  });   
  
   

  socket.on("user:call", ({ to, offer }) => {
    console.log(socket.id,"user:call")
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });



  socket.on("call:accepted", ({ to, ans }) => {
    console.log(to,ans)
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });
  


  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed");
    console.log(to,offer)
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });



  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done");
    console.log(to,ans)
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
  


  socket.on("call:disconnect", () => { 
    const email = socketidToEmailMap.get(socket.id);
    console.log("disconnect")
    console.log(email)
    if (email) {
      console.log(email)
      emailToSocketIdMap.delete(email);
      socketidToEmailMap.delete(socket.id);
    }
    console.log(`Socket Disconnected`, socket.id);   
  });

 

}); 
