import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { Box, Input, Button, HStack, VStack, Center ,Img,Text} from "@chakra-ui/react";
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
  
  
  
    
  <center>
    <Box
    backgroundColor="white"
    w="70%"
    h="80vh"
    my="10vh"
    rounded="30px"
    boxShadow="dark-lg"
   
  >
   <HStack>
   <Box  w="50%" h="80vh"  backgroundImage={`url(${video})`}  backgroundSize="cover" px="0px" mx="0px">
   
   </Box>
   <Box w="50%" h="80vh" display="flex" alignItems="center">
      <VStack spacing="30px" item="center">
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
                  colorScheme="green"
                  backgroundColor="#000000"
                  width="100%"
                  onClick={()=>{
                           navigate("/signup")
                  }}
                >
               Join
                </Button>
      </VStack>
      </Box>
      </HStack>
    </Box>
   
    </center>

    </>
  );
};

export default LobbyScreen;
