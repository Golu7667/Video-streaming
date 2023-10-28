import React, { useEffect, useState,useCallback } from "react";
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
  useToast
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
 const {user,setRemoteUser,socket,remoteuser,setLogout}=useSocket()
  const [mySocketId,SetMySocketId]=useState(null)
  const [dataButton,setDataButton]=useState(false)
  const [roomId,setRoomId]=useState("mittingId157")
   const toast=useToast()

  console.log(remoteSocketId)



 const handleJoinRoom = (login) => {
  console.log("handle Room join")
  socket.emit("room:join", { email: login.email, room:roomId, name:login.name });
  console.log("handle after")
  socket.on("user:joined", (data) => {
    // Data contains the email, socket.id, and name
    const { email, id, name } = data;
     console.log(id)
    SetMySocketId(id)
    toast({
      title:"Uer joined",
      status:"success",
      duration:1000, 
      isClosable: true, 
      position: "bottom",
     }) 
    SetMySocketId(id)
    console.log(`User ${name} with email ${email} and ID ${id} has joined the room.`);
   
  });
}


const handleIncommingCall = useCallback(
  async ({ from, offer }) => {
    console.log(from,offer)
    setRemoteUser(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    console.log(`Incoming Call`, from, offer);
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans });
  },
  [socket]
);

const handleCallUser = useCallback(async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteuser, offer });
   
   
    setMyStream(stream);
    
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      // The user denied camera or microphone access
      window.alert('This is a simple alert message.');
     
      // You can show a message to the user or handle this case as needed
    } else if (error.name === 'NotFoundError') {
      // The requested device is not found
      window.alert('Requested camera or microphone not found');
     
      // You can show a message to the user or handle this case as needed
    } else {
      // Handle other errors as needed
      window.alert('Error accessing camera and microphone:', error);
      
    }
  }
}, [remoteuser, socket, setMyStream, ]);



console.log(remoteuser)
 const handleSubmitForm = useCallback(() => {
 
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  console.log(userInfo)
 
}, []);

  useEffect(() => {
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setLogin(userInfo)
   if(userInfo){
   
    navigate("/home")
   }else{
    navigate("/")
   }
 
}, []);

  
  
  console.log(user)
  console.log(data);
  console.log(login);
  const handeluser = async () => {
    const allusers = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/use/users`);
    const userdata = allusers.data;
    setDataButton(true)
    setData(userdata);
  };

  

  const handleselect = (remoteuser) => {
      console.log("handleselect")
      handleCallUser()
      handleSubmitForm()
      setRemoteUser(remoteuser)
     
      navigate(`/room/${roomId}`)
     
  };
  const handleSignout = () => {
    console.log("logout");
    localStorage.removeItem("userInfo");
    setLogout(true)
    navigate("/")
   
  };
  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );
  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteuser });
  }, [remoteuser, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    return () => {
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    }
  },[ socket,  handleIncommingCall, handleNegoNeedIncomming,
    handleNegoNeedFinal,])

  return (
    <> { !user ? <h1>Loading</h1>:
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
                <Box w={["100%", "100%", "100%"]}
              h="70vh" display="flex" alignItems="center" justifyContent="center">
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
              )  : <></>}
              <VStack>
                {dataButton === true && data.length===0 ?<Box w="full" h="100%" display="flex" justifyContent="center" alignItems="center"><Text fontFamily="Arvo">No Record Found</Text></Box> :data.map((user) => (
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
                    onClick={() => handleselect(user._id)}
                    _hover={{ bgColor: "blue.200", color: "white" }}
                  >
                    <Avatar
                      name="Dan Abrahmov"
                      src="https://bit.ly/dan-abramov"
                    >{user.active ?
                      <AvatarBadge boxSize="1em" bg="green.500" />
                      :
                      <AvatarBadge  bg='tomato' boxSize="1em" />
                    }
                    </Avatar>
                    <Text color="black" fontFamily="Arvo" ml="10px" w="100px">
                      {user.name}
                    </Text>
                    <FiPhone bgColor="green.500" />
                  </Box>
                ))}
              </VStack>
            </Box>
          </VStack>
          <Box w={["100%", "100%", "50%"]} px="20px" py="10px"  >
            <VStack  >
              <HStack w="100%"  >
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
              <Box
                w="100%"
             
                boxShadow="dark-lg"
                rounded="30px"
                display="flex"
               
              >{
                !login ?  <Skeleton height='20px' />:

                <VStack w="100%" h="69vh"  gap="0px">
               
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
                      <Box fontFamily="Arvo" color="white">
                        Socket Id:{mySocketId}
                      </Box>
                    </VStack>
                  </Box>
                  <Box w="100%" h="35vh" display="flex" justifyContent="center"   bgColor="teal.200"  borderRadius="0px 0px 30px 30px">
                    <VStack w="100%" >
                    
                      <Text fontFamily="Arvo" color="black" mt="5px">
                      Incoming Call
                      </Text>
                      <HStack h="100px">  <Text fontFamily="Arvo" color="white">Active Account</Text>
                      <Button bgColor="blue.400" color="white" onClick={()=>handleJoinRoom(user)}>Join</Button></HStack>
                    
                      <Box
                       
                        boxShadow="dark-lg"
                        w="90%"
                        h="50px"
                        rounded="10px"
                        display="flex"
                        alignItems="center"
                        mt="10px"
                        bgColor="white"
                        onClick={() => handleselect(user._id)}
                      
                      
                      >
                        <Avatar
                          name="Dan Abrahmov"
                          src="https://bit.ly/dan-abramov"
                        >
                          <AvatarBadge boxSize="1em" bg="green.500" />
                        </Avatar>
                        <Text
                          color="black"
                          fontFamily="Arvo"
                          fontSize="sm"
                          w="100px"
                        >
                          {remoteSocketId}
                        </Text>
                        <Box w="70%" display="flex" alignItems="center" justifyContent='flex-end'>
                        <Text  color="black"   fontFamily="Cedarville Cursive">user.email</Text>
                        <Button bg="green.500" mx="2px" color="white"  _hover={{ bgColor: "green.300", color: "white" }} onClick={()=>handleCallAccepted}>Accepte</Button> 
                        <Button bg="tomato"  color="white"  _hover={{ bgColor: "tomato.100", color: "white" }}>Decline</Button>
                        </Box>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>

              }
              </Box>
            </VStack>
          </Box>
        </Box>
      </VStack>
    }
    </>
  );
};

export default HomePage;
