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

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [callButton, setCallButton] = useState(false);

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
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
    setCallButton(true);
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

  const handleDisconnect = () => {
    socket.emit("call:disconnect", { to: remoteSocketId });

    if (myStream) {
      myStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    setRemoteStream(null);
    setRemoteSocketId(null);
  };
  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

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
            <Heading>Video Call</Heading>
            <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
          </VStack>
        </Center>
      </VStack>
      <HStack w="100%" h="82vh">
        <VStack w="50%">
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
                  width="530px"
                  url={myStream}
                  style={{ borderRadius: "30px", overflow: "hidden" }}
                />
              </VStack>
            )}
          </Box>
          <Center>
            <Box w="50%">
              {remoteSocketId && (
                <Button
                  variant="solid"
                  colorScheme="green"
                  backgroundColor="green"
                  width="200px"
                  onClick={handleCallUser}
                >
                  <FiPhone />
                  CALL
                </Button>
              )}
            </Box>
          </Center>
        </VStack>
        <VStack w="50%">
          <Box
            w="100%"
            h="400px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            boxShadow="dark-lg"
            borderRadius="10px"
          >
            {!remoteStream && !callButton && (
              <Skeleton w="100%" h="400px" bg="blue.500" />
            )}
            {remoteStream && (
              <VStack>
                <ReactPlayer
                  playing
                  muted
                  height="400px"
                  width="530px"
                  url={remoteStream}
                  style={{ borderRadius: "30px", overflow: "hidden" }}
                />
              </VStack>
            )}
          </Box>
          <Center>
            <Box w="50%">
              {myStream && (
                <Button
                  variant="solid"
                  colorScheme="green"
                  backgroundColor="green"
                  width="200px"
                  onClick={sendStreams}
                >
                  <VscCallIncoming />
                  Call Accepte
                </Button>
              )}
            </Box>
          </Center>
        </VStack>
      </HStack>
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
    </>
  );
};

export default RoomPage;
