import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div style={{display:"flex", alignItems:"center",justifyContent:"center",width:"100vw",height:"100vh"}} >
      <div style={{}} >
      <h1>Enter video call </h1>
      </div>
      <div style={{width:"50vw",height:"50vh"}} >
      <form onSubmit={handleSubmitForm}>
      <div  style={{display:"flex", alignItems:"center",justifyContent:"center", gap:"30px"}}>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{borderRadius:"10px",height:"30px"}}
        />
       </div>
       <div  style={{display:"flex", alignItems:"center",justifyContent:"center"}}>
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          style={{borderRadius:"10px",height:"30px"}}
        />
       </div>
        <button  style={{display:"flex", alignItems:"center",justifyContent:"center"}}>Join</button>
      </form>
      </div>
    </div>
  );
};

export default LobbyScreen;
