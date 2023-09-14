import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { Box, Input, Button, HStack, VStack, Center ,Img,Text, Divider} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import video from "../vide.svg"
 
const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    () => {
     
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
  
  <Center>
  <VStack>
  <Text fontFamily="bold" fontSize="2xl" mt="10px">Welcome To My Video Call App </Text>
  <Divider w={["70px","300px","400px"]} h="10px" color="black" bgColor="black" mb="10Px"/>
  </VStack>
  </Center>
 <Center>
 
  
    <Box
    backgroundColor="white"
    w={["100%","70%","70%"]}
    h="80vh"
   
    rounded="30px"
    boxShadow="dark-lg"
   
  >
   <HStack>
  
   <Box display={{ base: "none", md: "flex" }}w={["50%","100%","100%"]} h="78vh"  >
    <Img src={video}/>
   </Box>
   <Box w={["100%","100%","100%"]} h="80vh" display={{ base: "flex" }} alignItems="center" justifyContent="center">
      <VStack spacing="30px" item="center">
      <Text fontFamily="bold" fontSize='4xl'>Login</Text>
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
            value={room}
            type="email"
            placeholder="Enter Your Room Number"
            onChange={(e) => setRoom(e.target.value)}
            bg="white"
          />
            </HStack>
        </FormControl> 
        <Button
                  variant="solid"
                  colorScheme="green"
                  backgroundColor="green"
                  width="100%"
                  onClick={()=>{
                    handleSubmitForm()
                  
                  }}
                >
               Join
                </Button>
      </VStack>
      </Box>
      </HStack>
    </Box>
    
    </Center>

    </>
  );
};

export default LobbyScreen;
