import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  useToast
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import video from "../vide.svg";
import axios from "axios"



const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [name,setName]=useState("")

  const socket = useSocket();
  const navigate = useNavigate();
  const toast = useToast();

 
  

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    
    if (userInfoString) {
      try {
        const user = JSON.parse(userInfoString);
        // Check if user is valid JSON
        if (user && typeof user === 'object') {
          navigate(`/room/1`);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);
  

  const handleSubmitForm = useCallback(() => {
    socket.emit("room:join", { email, room ,name});
  }, [email, room, socket,name]);

  const handleJoinRoom = useCallback(
    async(data) => {
      const { email, room ,name} = data;
      console.log(name)
      try{
      const user= await axios.post("http://localhost:8000/api/use/",{email,name})
      console.log(user.data)  
       toast({
        title:"User Join",
        status:"success",
        duration:5000, 
        isClosable: true, 
        position: "bottom",
       }) 
     
     localStorage.setItem("userInfo", JSON.stringify(user.data)); 
      
     navigate(`room/${room}`);

      }catch(error){
        toast({
          title:"User Not Register",
          description:error,
          status:"error",
          duration:5000,
          isClosable: true,
          position: "bottom",
         })
         console.log(error)
      }
     
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
          <Text fontFamily="bold" fontSize="2xl" mt="10px">
            Welcome To My Video Call App{" "}
          </Text>
          <Divider
            w={["70px", "300px", "400px"]}
            h="10px"
            color="black"
            bgColor="black"
            mb="10Px"
          />
        </VStack>
      </Center>
      <Center>
        <Box
          backgroundColor="white"
          w={["100%", "96%", "80%"]}
          h={["100%", "100%", "80vh"]}
          display={{ base: "block", md: "flex" }}
          rounded="30px"
          boxShadow="dark-lg"
          my="30px"
          py="10px"
        >
          <Box
            display={{ base: "flex", md: "flex" }}
            w={["100%", "100%", "100%"]}
            justifyContent="center"
            alignItems="center"
            overflow="hidden"
          >
            <Img src={video} w={["70%", "80%", "70%"]} overflow="hidden" />
          </Box>
          <Center
            w={["100%", "100%", "50%"]}
            display={{ base: "flex", md: "flex" }}
            alignItems="center"
            justifyContent="center"
            px="20px"
            pb="10px"
          >
            <VStack spacing="30px" item="center">
              <Text fontFamily="bold" fontSize="4xl">
                Login
              </Text>
              <FormControl id="name" isRequired>
                <HStack>
                  <FormLabel color="black">Name</FormLabel>
                  <Input
                    value={name}
                    type="name"
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                    bg="white"
                  />
                </HStack>
              </FormControl>
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

              <FormControl id="room" isRequired>
                <HStack>
                  <FormLabel color="black">Room</FormLabel>
                  <Input
                    value={room}
                    type="room"
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
                onClick={() => {
                  handleSubmitForm();
                }}
              >
                Join
              </Button>
            </VStack>
          </Center>
        </Box>
      </Center>
    </>
  );
};

export default LobbyScreen;
