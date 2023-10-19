import React, { createContext, useMemo, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";



const SocketContext = createContext(null);

export const useSocket = () => { 
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const [user, setUser] = useState();
  const navigate=useNavigate()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const socket = useMemo(() => io("http://localhost:8000"), []);

  return (
    <SocketContext.Provider value={{socket, user}}>
      {props.children}
    </SocketContext.Provider>
  );
};
