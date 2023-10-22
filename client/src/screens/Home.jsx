import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Img,
  Avatar,
  AvatarBadge,
  Button,
  Skeleton
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import profile from "../profile.svg";
import axios from "axios";
import { CiMicrophoneOn, CiMicrophoneOff } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { useSocket } from "../context/SocketProvider";
import { VscAccount } from "react-icons/vsc";




const HomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [login, setLogin] = useState();
 const {user}=useSocket()
  
  useEffect(() => {
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
   if(userInfo){
    navigate("/home")
   }else{
    navigate("/")
   }
 
}, []);

  
  
  console.log(user)
  console.log(data);
  console.log(login);
  const handeluser = async () => {
    const allusers = await axios.get("http://localhost:8000/api/use/users");
    const userdata = allusers.data;
    setData(userdata);
  };

  const handleselect = (user) => {
      
   
    console.log(user);
  };
  const handleSignout = () => {
    console.log("logout");
    localStorage.removeItem("userInfo");
    navigate("/")
   
  };

  return (
    <>
      <VStack>
        <Box
          w={["100%", "100%", "80%"]}
          h={["100%", "100%", "100%"]}
          display="flex"
          rounded="30px"
          boxShadow="dark-lg"
          mt="30px"
          py="10px"
          justifyContent="center"
          alignItems="center"
         
        >
          <Text fontFamily="Arvo" color="blue.500">
            Welcome To Video Call App
          </Text>
        </Box>
        <Box
          w={["100%", "100%", "95%"]}
          h={["80vh", "100%", "80vh"]}
          display={{ base: "block", md: "flex" }}
          rounded="30px"
          boxShadow="dark-lg"
          py="10px"
         
        >
          <VStack w={["100%", "100%", "50%"]} h="80vh" px="10px">
            <Box display="flex" justifyContent="flex" alignItems="flex">
              <Text fontFamily="Arvo">All user </Text>
            </Box>
            <Box
              w={["100%", "100%", "100%"]}
              h="70vh"
              boxShadow="dark-lg"
              rounded="30px"
              mt="20px"
              display="flex"
              justifyContent="center"
              overflowY="auto"
             
            >
              {data.length === 0 && (
                <Box w={["100%", "100%", "100%"]}
              h="70vh" display="flex" alignItems="center" justifyContent="center">
                <Button
                  bgColor="green.500"
                  color="white"
                  _hover={{ bgColor: "black", color: "white" }}
                  onClick={() => {
                    handeluser();
                  }}
                  
                >
                  See all users
                </Button>
                </Box>
              )}
              <VStack>
                {data.map((user) => (
                  <Box
                    key={user._id}
                    boxShadow="dark-lg"
                    w="300px"
                    h="50px"
                    rounded="10px"
                    display="flex"
                    alignItems="center"
                    mt="10px"
                    gap="50px"
                    onClick={() => handleselect(user._id)}
                    _hover={{ bgColor: "blue.200", color: "white" }}
                  >
                    <Avatar
                      name="Dan Abrahmov"
                      src="https://bit.ly/dan-abramov"
                    >
                      <AvatarBadge boxSize="1em" bg="green.500" />
                    </Avatar>
                    <Text color="black" fontFamily="Arvo" ml="10px" w="100px">
                      {user.name}
                    </Text>
                    <FiPhone bgColor="green.500" />
                  </Box>
                ))}
              </VStack>
            </Box>
          </VStack>
          <Box w={["100%", "100%", "50%"]} px="20px" py="10px"  >
            <VStack  >
              <HStack w="100%"  >
                <Img
                  src={profile}
                  alt="profile photo"
                  width="40px"
                  height="40px"
                  borderRadius="full"
                  border="1px"
                  style={{ marginLeft: "auto" }}
                  transition="transform 0.3s ease"
                  _hover={{ transform: "scale(1.2)" }}
                />
                <Text fontFamily="Arvo" onClick={() => handleSignout()}>
                  SignOut
                </Text>
              </HStack>
              <Box
                w="100%"
             
                boxShadow="dark-lg"
                rounded="30px"
                display="flex"
               
              >{
                !user ?  <Skeleton height='20px' />:

                <VStack w="100%" h="69vh"  gap="0px">
                  <Box
                    w="100%"
                    display="flex"
                    justifyContent="center"
                    h="35vh"
                    alignItems="center"
                    bgColor="pink.400"
                    borderRadius="30px 30px 0 0"
                  >
                    <VStack display="block">
                      <Box fontFamily="Arvo" color="white">
                        User Id :{user._id}
                      </Box>
                      <Box fontFamily="Arvo" color="white">
                        Name:{user.name}
                      </Box>
                      <Box fontFamily="Arvo" color="white">
                        Email:{user.email}
                      </Box>
                    </VStack>
                  </Box>
                  <Box w="100%" h="35vh" display="flex" justifyContent="center"   bgColor="teal.200"  borderRadius="0px 0px 30px 30px">
                    <VStack w="100%" >
                    
                      <Text fontFamily="Arvo" color="black" mt="5px">
                      Incoming Call
                      </Text>
                      <Box
                       
                        boxShadow="dark-lg"
                        w="90%"
                        h="50px"
                        rounded="10px"
                        display="flex"
                        alignItems="center"
                        mt="10px"
                        bgColor="white"
                        onClick={() => handleselect(user._id)}
                      
                      
                      >
                        <Avatar
                          name="Dan Abrahmov"
                          src="https://bit.ly/dan-abramov"
                        >
                          <AvatarBadge boxSize="1em" bg="green.500" />
                        </Avatar>
                        <Text
                          color="black"
                          fontFamily="Arvo"
                          fontSize="sm"
                          w="100px"
                        >
                          {user.name}
                        </Text>
                        <Box w="70%" display="flex" alignItems="center" justifyContent='flex-end'>
                        <Text  color="black"   fontFamily="Cedarville Cursive">user.email</Text>
                        <Button bg="green.500" mx="2px" color="white"  _hover={{ bgColor: "green.300", color: "white" }} >Accepte</Button> 
                        <Button bg="tomato"  color="white"  _hover={{ bgColor: "tomato.100", color: "white" }}>Decline</Button>
                        </Box>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>

              }
              </Box>
            </VStack>
          </Box>
        </Box>
      </VStack>
    </>
  );
};

export default HomePage;
