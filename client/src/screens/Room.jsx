import React, { useEffect, useCallback, useState, useRef  } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import {
  Box,
  Input,
  Button,
  HStack,
  VStack,
  Center,
  Img,
  Text,
  Divider,
  Circle,
  Heading,
  Skeleton,
  
} from "@chakra-ui/react";
import { FiPhone } from "react-icons/fi";
import { VscCallIncoming } from "react-icons/vsc";
import video from "../vide.svg"
import waveAudio from "../digital-wave-audio.svg"
import {CiMicrophoneOn,CiMicrophoneOff} from "react-icons/ci"
import { useNavigate } from "react-router-dom";




const RoomPage = (props) => {
  const {socket,user,remoteuser,setRemoteUser} = useSocket();
 
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [callButton, setCallButton] = useState(false);
  const navigate=useNavigate()

  
  
  

  useEffect(() => {
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
   if(userInfo){
   
   }else{
    navigate("/")
   }
 
}, []);

  

   const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteuser, offer });
     
     
      setMyStream(stream);
      setCallButton(true);
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
  }, [remoteuser, socket, setMyStream, setCallButton]);
  
 






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

  const handleDisconnect = () => {
    socket.emit("call:disconnect", { to: remoteuser });

    if (myStream) {
      myStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
   
    
    
  };
  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log(remoteStream[0])
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, [setRemoteStream]);

  useEffect(() => {
   
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("call:disconnect", handleDisconnect);
    return () => {
     
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("call:disconnect", handleDisconnect)
    };
  }, [
    socket,
   
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    handleDisconnect
  ]);

  return (
    <>
      <VStack>
        <Center>
          <VStack>
            <HStack  mt="10px" >
            <Img  src={video} w="40px"/> 
            <Heading fontFamily="Arvo">Video Call</Heading>
            </HStack>
            <Text fontFamily="Arvo">{remoteuser ? "Connected" : "No one in room"}</Text>
          </VStack>
        </Center>
      </VStack>
      <Box w="100%"  display={{ base: "block", md: "flex" }} my="10px">
        <Box w={["100%","100%","50%"]} my="10px">
          <Box
            w="100%"
            h="460px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            boxShadow="dark-lg"
            borderRadius="10px"
          >
            {myStream && (
              <VStack>
                <ReactPlayer
                  playing
                 
                  height="460px"
                  width="100%"
                  url={myStream}
                  style={{ borderRadius: "30px", overflow: "hidden" }}
                />
                
                
               
              </VStack>

            )}
           
          </Box>
          <Center>
            
              (
                <Button
                  variant="solid"
                  colorScheme="green"
                  backgroundColor="green"
                  width="200px"
                  onClick={handleCallUser}
                  mt="10px"
                >
                  <FiPhone />
                  CALL
                </Button>
              )
           
          </Center>
        </Box>
        <Box w={["100%","100%","50%"]} my="10px">
          <Box
            w="100%"
            h="460px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            boxShadow="dark-lg"
            borderRadius="10px"
          >
            {!remoteStream && callButton && (
              <Skeleton w="100%" h="400px" bg="blue.500" />
            )}
            {remoteStream && (
              <VStack>
                <ReactPlayer
                  playing
               
                  height="460px"
                  width="100%"
                  url={remoteStream}
                  style={{ borderRadius: "30px", overflow: "hidden" }}
                />
                   
               
              </VStack>
            )}
          </Box>
          <Center>
           
              {myStream && (
                <Button
                  variant="solid"
                  colorScheme="green"
                  backgroundColor="green"
                  width="200px"
                  onClick={sendStreams}
                  mt="10px"
                >
                  <VscCallIncoming />
                  Call Accepte
                </Button>
              )}
           
          </Center>
        </Box>
      </Box>
       <Center >
      {remoteuser && (
        <Button
          variant="solid"
          colorScheme="red"
          backgroundColor="red"
          width="200px"
          onClick={handleDisconnect}
          
        >
          Disconnect
        </Button>
      )}
      </Center>
     
    </>
  );
};

export default RoomPage;
