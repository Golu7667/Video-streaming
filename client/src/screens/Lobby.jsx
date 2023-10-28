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
  const [name,setName]=useState("")
  const [loading,setLoading]=useState(false)



  const {socket,user} = useSocket();
  const navigate = useNavigate();
  const toast = useToast();
 
 
  useEffect(() => {
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
   if(userInfo){
    navigate("/home")
   }else{
    navigate("/")
   }
 
}, []);
 
 

  

  const handleJoinRoom = useCallback(


    async() => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
     setLoading(true)
     if (!emailRegex.test(email)) {
      setLoading(false)
      toast({
        title:"Please Enter Valid Email Id",
        status:"error",
        duration:5000, 
        isClosable: true, 
        position: "bottom",
       }) 
       return ;
     }
   
      try{
        const requestData = {
          email: email.toLowerCase(),
          name:  name.toLowerCase(),
        };
      const user= await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/use/`,requestData )
      console.log(user.data)  
       toast({
        title:"User Join",
        status:"success",
        duration:5000, 
        isClosable: true, 
        position: "bottom",
       }) 
     
        localStorage.setItem("userInfo", JSON.stringify(user.data)); 
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        console.log(userInfo)
       
       
         setLoading(false)
         navigate(`/home`);
        
      
     

  
    
      }catch(error){
        toast({
          title:"User Not Register",
          description:error,
          status:"error",
          duration:5000,
          isClosable: true,
          position: "bottom",
         })
        setLoading(false)
      }
     
    }, 
    [email, socket,name]
  );
 
   


  

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
              <Button
                variant="solid"
                colorScheme="green"
                backgroundColor="green"
                width="100%"
                onClick={() => {
                  handleJoinRoom();
                }}
                isLoading={loading} 
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
