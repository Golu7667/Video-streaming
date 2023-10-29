import React, {
  createContext,
  useMemo,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const SocketContext = createContext(null);

export const SocketProvider = (props) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    setUser(userInfo);
  }, [navigate]);

  const socket = useMemo(() => io(process.env.REACT_APP_BACKEND_URL), []);

  return (
    <SocketContext.Provider value={{ socket, user }}>
      {props.children}
    </SocketContext.Provider>
  );
};
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
