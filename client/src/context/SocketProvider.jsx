import React, { createContext, useMemo, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";



const SocketContext = createContext(null);

export const useSocket = () => { 
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const [user, setUser] = useState(null);
  const navigate=useNavigate()
  console.log(user) 
  useEffect(() => {
    async function fetchUserData() {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      setUser(userInfo);
    }

    fetchUserData();
  }, []);
  const socket = useMemo(() => io("http://localhost:8000"), []);
  if (!user) { 
    return <div>Loading...</div>;
  }

console.log("after")
  

  return (
    <SocketContext.Provider value={{socket, user}}>
      {props.children}
    </SocketContext.Provider>
  );
};
