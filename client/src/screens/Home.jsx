import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Img,
  Avatar,
  AvatarBadge,
  Button,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import profile from "../profile.svg";
import axios from "axios";
import { CiMicrophoneOn, CiMicrophoneOff } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { useSocket } from "../context/SocketProvider";
import { VscAccount } from "react-icons/vsc";
import RoomPage from "./Room";
import { Routes, Route } from "react-router-dom";
import peer from "../service/peer";

const HomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [login, setLogin] = useState();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const { user, setRemoteUser, socket, remoteuser, setLogout } = useSocket();
  const [mySocketId, SetMySocketId] = useState(null);
  const [dataButton, setDataButton] = useState(false);
  const [roomId, setRoomId] = useState("mittingId157");
  const toast = useToast();
  const [email,setEmail]=useState()
  
  const handleSubmitForm = useCallback(
    (e) => {
      
      
      socket.emit("room:join", { email, roomId });
    },
    [email, roomId, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  
  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLogin(userInfo);
    if (userInfo) {
      setEmail(userInfo.email)
      navigate("/home");
    } else {
      navigate("/");
    }
  }, []);

 
  const handeluser = async () => {
    const allusers = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/use/users`
    );
    const userdata = allusers.data;
    setDataButton(true);
    setData(userdata);
  };

  
  const handleSignout = () => {
    console.log("logout");
    localStorage.removeItem("userInfo");
    setLogout(true);
    navigate("/");
  };
  
  
  
  return (
    <>
      {" "}
      {!user ? (
        <h1>Loading</h1>
      ) : (
        <VStack>
          <Box
            w={["100%", "100%", "80%"]}
            h={["100%", "100%", "100%"]}
            display="flex"
            rounded="30px"
            boxShadow="dark-lg"
            mt="30px"
            py="10px"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontFamily="Arvo" color="blue.500">
              Welcome To Video Call App
            </Text>
          </Box>
          <Box
            w={["100%", "100%", "95%"]}
            h={["80vh", "100%", "80vh"]}
            display={{ base: "block", md: "flex" }}
            rounded="30px"
            boxShadow="dark-lg"
            py="10px"
          >
            <VStack w={["100%", "100%", "50%"]} h="80vh" px="10px">
              <Box display="flex" justifyContent="flex" alignItems="flex">
                <Text fontFamily="Arvo">All user </Text>
              </Box>
              <Box
                w={["100%", "100%", "100%"]}
                h="70vh"
                boxShadow="dark-lg"
                rounded="30px"
                mt="20px"
                display="flex"
                justifyContent="center"
                overflowY="auto"
              >
                {dataButton === false ? (
                  <Box
                    w={["100%", "100%", "100%"]}
                    h="70vh"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button
                      bgColor="green.500"
                      color="white"
                      _hover={{ bgColor: "black", color: "white" }}
                      onClick={() => {
                        handeluser();
                      }}
                    >
                      See all users
                    </Button>
                  </Box>
                ) : (
                  <></>
                )}
                <VStack>
                  {dataButton === true && data.length === 0 ? (
                    <Box
                      w="full"
                      h="100%"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontFamily="Arvo">No Record Found</Text>
                    </Box>
                  ) : (
                    data.map((user) => (
                      <Box
                        key={user._id}
                        boxShadow="dark-lg"
                        w="300px"
                        h="50px"
                        rounded="10px"
                        display="flex"
                        alignItems="center"
                        mt="10px"
                        gap="50px"
                        _hover={{ bgColor: "blue.200", color: "white" }}
                      >
                        <Avatar
                          name="Dan Abrahmov"
                          src="https://bit.ly/dan-abramov"
                        >
                         
                        </Avatar>
                        <Text
                          color="black"
                          fontFamily="Arvo"
                          ml="10px"
                          w="100px"
                        >
                          {user.name}
                        </Text>
                        <FiPhone bgColor="green.500" />
                      </Box>
                    ))
                  )}
                </VStack>
              </Box>
            </VStack>
            <Box w={["100%", "100%", "50%"]} px="20px" py="10px">
              <VStack>
                <HStack w="100%">
                  <Img
                    src={profile}
                    alt="profile photo"
                    width="40px"
                    height="40px"
                    borderRadius="full"
                    border="1px"
                    style={{ marginLeft: "auto" }}
                    transition="transform 0.3s ease"
                    _hover={{ transform: "scale(1.2)" }}
                  />
                  <Text fontFamily="Arvo" onClick={() => handleSignout()}>
                    SignOut
                  </Text>
                </HStack>
                <Box w="100%" boxShadow="dark-lg" rounded="30px" display="flex">
                  {!login ? (
                    <Skeleton height="20px" />
                  ) : (
                    <VStack w="100%" h="69vh" gap="0px">
                      <Box
                        w="100%"
                        display="flex"
                        justifyContent="center"
                        h="35vh"
                        alignItems="center"
                        bgColor="pink.400"
                        borderRadius="30px 30px 0 0"
                      >
                        <VStack display="block">
                          <Box fontFamily="Arvo" color="white">
                            User Id :{login._id}
                          </Box>
                          <Box fontFamily="Arvo" color="white">
                            Name:{login.name}
                          </Box>
                          <Box fontFamily="Arvo" color="white">
                            Email:{login.email}
                          </Box>
                        
                        </VStack>
                      </Box>
                      <Box
                        w="100%"
                        h="35vh"
                        display="flex"
                        justifyContent="center"
                        bgColor="teal.200"
                        borderRadius="0px 0px 30px 30px"
                      >
                        <VStack w="100%">
                          <Text fontFamily="Arvo" color="black" mt="5px">
                            Join Room
                          </Text>
                          <HStack h="100px">
                            {" "}
                            <Text fontFamily="Arvo" color="white">
                             Join Room 
                            </Text>
                            <Button
                              bgColor="blue.400"
                              color="white"
                              onClick={() => handleSubmitForm()}
                            >
                              Join
                            </Button>
                          </HStack>

                          
                            
                         
                        </VStack>
                      </Box>
                    </VStack>
                  )}
                </Box>
              </VStack>
            </Box>
          </Box>
        </VStack>
      )}
    </>
  );
};

export default HomePage;
