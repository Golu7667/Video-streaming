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
import waveAudio from "../digital-wave-audio.svg"
import {CiMicrophoneOn,CiMicrophoneOff} from "react-icons/ci"
import { useNavigate } from "react-router-dom";




const RoomPage = (props) => {
  const {socket,user,remoteuser} = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [callButton, setCallButton] = useState(false);
  const [audio,setAudio]=useState()
  const [audioStatus, setAudioStatus] = useState('silent');
  const [mute,setMute]=useState(false)
  const [remoteAudioStatus,setremoteAudioStatus]=useState('silent')
  const [remoteMute,setRemoteMute]=useState(false)
  const [remoteAudio,setRemoteAudio]=useState()
  const navigate=useNavigate()
 
  console.log(remoteuser) 
 

  console.log(remoteSocketId);
  
  

  useEffect(() => {
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
   if(userInfo){
   
   }else{
    navigate("/")
   }
 
}, []);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);   
    setRemoteSocketId(id);
  }, []);
 
   const handelmute=()=>{
    console.log("handlemute working")
    setMute(!mute)
   }
  
   const handelremotemute=()=>{
    setRemoteMute(!remoteMute)
   }

   const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteSocketId, offer });




      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
       const stream1 = await navigator.mediaDevices.getUserMedia({ audio: true});

        // Create an audio source node from the stream
        const audioSource = audioContext.createMediaStreamSource(stream1);

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
          const threshold = 30;
            console.log("handleCallUser")
          if (average > threshold) {
            setAudioStatus('speaking');
          } else {
            setAudioStatus('silent');
          }
          requestAnimationFrame(checkAudioVolume); // Continuously update status
        };

        // Start analyzing audio
        audioContext.resume().then(() => {
          // analyzer.connect(audioContext.destination);
          checkAudioVolume();
        })
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
  }, [remoteSocketId, socket, setMyStream, setCallButton]);
  
 

  // useEffect(() => {
  //   console.log(callButton)
    
  //   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  //  console.log("audio working in useEffect")
  //   const analyzeAudio = async () => {
  //     try {
      
  //       const stream1 = await navigator.mediaDevices.getUserMedia({ audio: true});

  //       // Create an audio source node from the stream
  //       const audioSource = audioContext.createMediaStreamSource(stream1);

  //       // Create an analyzer node to process the audio
  //       const analyzer = audioContext.createAnalyser();
  //       analyzer.fftSize = 256;

  //       // Connect the audio source to the analyzer
  //       audioSource.connect(analyzer);

  //       const dataArray = new Uint8Array(analyzer.frequencyBinCount);

  //       // Function to continuously check audio volume and update status
  //       const checkAudioVolume = () => {
  //         analyzer.getByteFrequencyData(dataArray);
  //         const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

  //         // Adjust the threshold based on your environment
  //         const threshold = 30;

  //         if (average > threshold) {
  //           setAudioStatus('speaking');
  //         } else {
  //           setAudioStatus('silent');
  //         }
  //         requestAnimationFrame(checkAudioVolume); // Continuously update status
  //       };

  //       // Start analyzing audio
  //       audioContext.resume().then(() => {
  //         // analyzer.connect(audioContext.destination);
  //         checkAudioVolume();
  //       });
  //     } catch (error) {
  //       console.error('Error accessing audio:', error);
  //       setAudioStatus('error');
  //     }
  //   };

  //   // Initialize audio analysis
  //   analyzeAudio();

  //   return () => {
  //     audioContext.close();
  //   };
  
  // }, []);
 
  // useEffect(() => {
  //   const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  //   const analyzeAudio = async () => {
  //     try {
  //       const stream1 = await navigator.mediaDevices.getUserMedia({ audio: !remoteMute ? true: false});

  //       // Create an audio source node from the stream
  //       const audioSource = audioContext.createMediaStreamSource(stream1);

  //       // Create an analyzer node to process the audio
  //       const analyzer = audioContext.createAnalyser();
  //       analyzer.fftSize = 256;

  //       // Connect the audio source to the analyzer
  //       audioSource.connect(analyzer);

  //       const dataArray = new Uint8Array(analyzer.frequencyBinCount);

  //       // Function to continuously check audio volume and update status
  //       const checkAudioVolume = () => {
  //         // analyzer.getByteFrequencyData(dataArray);
  //         const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

  //         // Adjust the threshold based on your environment
  //         const threshold = 30;

  //         if (average > threshold) {
  //           setremoteAudioStatus('speaking');
  //         } else {
  //           setremoteAudioStatus('silent');
  //         }
  //         requestAnimationFrame(checkAudioVolume); // Continuously update status
  //       };

  //       // Start analyzing audio
  //       audioContext.resume().then(() => {
  //         analyzer.connect(audioContext.destination);
  //         checkAudioVolume();
  //       });
  //     } catch (error) {
  //       console.error('Error accessing audio:', error);
  //       setremoteAudioStatus('error');
  //     }
  //   };

  //   // Initialize audio analysis
  //   analyzeAudio();

  //   return () => {
  //     audioContext.close();
  //   };
  // }, [remoteMute]);









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
      console.log(remoteStream[0])
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
                  muted
                  height="400px"
                  width="100%"
                  url={myStream}
                  style={{ borderRadius: "30px", overflow: "hidden" }}
                />
                 <Box width="100px"  height="40px"  bgColor="green.100" borderRadius="10px">
                 <HStack>{
                  mute? <CiMicrophoneOff  style={{ fontSize: '2em' }}  onClick={handelmute}/> :
                <CiMicrophoneOn style={{ fontSize: '2em' }} onClick={handelmute}/>
                 }
                 {audioStatus!=="silent" && mute == false ? <Img src={waveAudio} width="40px"/>   
                 :mute==true ?<Text fontFamily="Arvo" color="green"  width="50px" height="20px">Mute</Text> :<Text width="40px" height="40px">.</Text>
                 }
                 </HStack>
                 </Box> 
               
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
                  muted
                  height="400px"
                  width="100%"
                  url={remoteStream}
                  style={{ borderRadius: "30px", overflow: "hidden" }}
                />
                <Box width="100px"  height="40px"  bgColor="green.100" borderRadius="10px">
                 <HStack>{
                  remoteMute? <CiMicrophoneOff  style={{ fontSize: '2em' }}  onClick={handelremotemute}/> :
                <CiMicrophoneOn style={{ fontSize: '2em' }} onClick={handelremotemute}/>
                 }
                 {remoteAudioStatus!=="silent" && remoteMute == false ? <Img src={waveAudio} width="40px"/>   
                 :remoteMute==true ?<Text fontFamily="Arvo" color="green"  width="50px" height="20px">Mute</Text> :<Text width="40px" height="40px">.</Text>
                 }
                 </HStack>
                 </Box> 
               
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
     
    </>
  );
};

export default RoomPage;
