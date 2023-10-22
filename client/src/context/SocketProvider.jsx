import React, { createContext, useMemo, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";



const SocketContext = createContext(null);



export const SocketProvider = (props) => {
  const [user, setUser] = useState(null);
  const navigate=useNavigate()
  console.log(user) 
  useEffect(() => {
    
      const userInfo =JSON.parse(localStorage.getItem('userInfo'));
      console.log("before useEffect")
      setUser(userInfo);
   
     console.log(user)
   
  }, []);
  
  console.log("27 ")
  
  const socket = useMemo(() => io("http://localhost:8000"), []);
 


 

  return (
    <SocketContext.Provider value={{socket, user}}>
      {props.children}
    </SocketContext.Provider>
  );
};
export const useSocket = () => { 
  const socket = useContext(SocketContext);
  return socket;
};
