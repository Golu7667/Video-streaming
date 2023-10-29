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
  const {socket}= useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const navigate=useNavigate()
  

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
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
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

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
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  const handleDisconnect=()=>{
    navigate("/home")
  }


  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
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
            <Text fontFamily="Arvo">{remoteSocketId ? "Connected" : "No one in room"}</Text>
          </VStack>
        </Center>
      </VStack>
      <Box w="100%"  display={{ base: "block", md: "flex" }} my="10px">
        <Box w={["100%","100%","50%"]} my="10px">
        <Box w="100%" display="flex" justifyContent="center" fontFamily="Arvo">My Video</Box>
          <Box
            w="100%"
            h="410px"
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
                 
                  height="410px"
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
        <Box w="100%" display="flex" justifyContent="center" fontFamily="Arvo">Remote Video</Box>
          <Box
            w="100%"
            h="410px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            boxShadow="dark-lg"
            borderRadius="10px"
          >
            
            {remoteStream && (
              <VStack>
                <ReactPlayer
                  playing
               
                  height="410px"
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
      
        <Button
          variant="solid"
          colorScheme="red"
          backgroundColor="red"
          width="200px"
          onClick={()=>handleDisconnect()}
        >
          Disconnect
        </Button>
  
      </Center>
     
    </>
  );
};

export default RoomPage;
