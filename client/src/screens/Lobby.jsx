import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { Box, Input, Button, HStack, VStack, Center ,Img} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import video from "../vide.svg"
 
const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
   <>
   <HStack>
    <Box w="50%">
      <Img src={video }/>
    </Box>

    <Box
    backgroundColor="white"
    w={[400, 400, 700]}
    h="100vh"
    rounded="30px"
    boxShadow="dark-lg"
    
  >
 
    <Center h="full">
      <VStack spacing="20px" item="center">
        <FormControl id="email" isRequired>
        <HStack>
          <FormLabel color="black">Email</FormLabel>
          <Input
            value={email}
            type="email"
            placeholder="Enter Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
            bg="white"
          />
          </HStack>
        </FormControl>

        <FormControl id="email" isRequired>
        <HStack>
          <FormLabel color="black">Room</FormLabel>
          <Input
            value={email}
            type="email"
            placeholder="Enter Your Room Number"
            onChange={(e) => setEmail(e.target.value)}
            bg="white"
          />
            </HStack>
        </FormControl> 
        <Button
                  variant="solid"
                  colorScheme="blue"
                  width="100%"
                  onClick={()=>{
                           navigate("/signup")
                  }}
                >
               Join
                </Button>
      </VStack>
    </Center>
    </Box>
    </HStack>
    </>
  );
};

export default LobbyScreen;
