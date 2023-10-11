import React, { useEffect, useCallback, useState } from "react";
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

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [callButton, setCallButton] = useState(false);
  const [audio,setAudio]=useState(false)
  const [audioStatus, setAudioStatus] = useState('silent');

  console.log(remoteSocketId);
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    // const offer = await peer.getOffer();
    // socket.emit("user:call", { to: remoteSocketId, offer });
     if(stream.getAudioTracks().length>0){
      console.log("loud1")
      setAudio(true)
     }else{
      console.log("not loud")
      setAudio(false)
     }
    setMyStream(stream);
    setCallButton(true);
  }, [remoteSocketId, socket,setMyStream]);

 

  useEffect(() => {
    const updateAudioStatus = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      try {
        
        if (stream.getAudioTracks().length > 0) {
          const audioTrack = stream.getAudioTracks()[0];
          if (audioTrack.enabled) {
            console.log("Audio is available and enabled.");
            setAudio(true);
          } else {
            console.log("Audio is available but not enabled.");
            setAudio(false);
          }
        }
       
      } catch (error) {
        console.error('Error accessing audio:', error);
        setAudio(false);
      }
    
    };

    // Initially check audio status
    updateAudioStatus();

    // Set up a timer to periodically check the audio status
    const audioCheckInterval = setInterval(updateAudioStatus, 1000); // Check every 10 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(audioCheckInterval);
  }, []);

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const analyzeAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Create an audio source node from the stream
        const audioSource = audioContext.createMediaStreamSource(stream);

        // Create an analyzer node to process the audio
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256;

        // Connect the audio source to the analyzer
        audioSource.connect(analyzer);

        const dataArray = new Uint8Array(analyzer.frequencyBinCount);

        // Function to continuously check audio volume and update status
        const checkAudioVolume = () => {
          analyzer.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

          // Adjust the threshold based on your environment
          const threshold = 10;

          if (average > threshold) {
            setAudioStatus('speaking');
          } else {
            setAudioStatus('silent');
          }
          requestAnimationFrame(checkAudioVolume); // Continuously update status
        };

        // Start analyzing audio
        audioContext.resume().then(() => {
          analyzer.connect(audioContext.destination);
          checkAudioVolume();
        });
      } catch (error) {
        console.error('Error accessing audio:', error);
        setAudioStatus('error');
      }
    };

    // Initialize audio analysis
    analyzeAudio();

    return () => {
      audioContext.close();
    };
  }, []);
 



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

  const handleDisconnect = () => {
    socket.emit("call:disconnect", { to: remoteSocketId });

    if (myStream) {
      myStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
   
    
    
  };
  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, [setRemoteStream]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("call:disconnect", handleDisconnect);
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("call:disconnect", handleDisconnect)
    };
  }, [
    socket,
    handleUserJoined,
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
            <Text fontFamily="Arvo">{remoteSocketId ? "Connected" : "No one in room"}</Text>
          </VStack>
        </Center>
      </VStack>
      <Box w="100%"  display={{ base: "block", md: "flex" }} my="10px">
        <Box w={["100%","100%","50%"]} my="10px">
          <Box
            w="100%"
            h="400px"
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
                  muted
                  height="400px"
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
            h="400px"
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
                  muted
                  height="400px"
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
      {remoteSocketId && (
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
      <h1>Audio Status: {audioStatus}</h1>
    </>
  );
};

export default RoomPage;
