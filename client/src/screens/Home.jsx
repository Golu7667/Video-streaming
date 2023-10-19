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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import profile from "../profile.svg";
import axios from "axios";
import {CiMicrophoneOn,CiMicrophoneOff} from "react-icons/ci"
import { FiPhone } from "react-icons/fi";
import { useSocket } from "../context/SocketProvider";


const HomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [login,setLogin]=useState()
  const {user}=useSocket()
  


  console.log(data);

  const handeluser = async () => {
    const allusers = await axios.get("http://localhost:8000/api/use/users");
    const userdata = allusers.data;
    setData(userdata);
  };

  useEffect(() => {
    if(user){
      navigate("/home")
    }else{
      navigate("/")
    }
  
  }, [navigate]);



  const handleselect=(user)=>{
     console.log(user)

  }
 const handleSignout=()=>{
  console.log("logout") 
  localStorage.removeItem("userInfo");

 }


  return (
    <>
      <VStack>
        <Box
          w={["100%", "96%", "80%"]}
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
          w={["100%", "96%", "80%"]}
          h={["80vh", "100%", "80vh"]}
          display={{ base: "block", md: "flex" }}
          rounded="30px"
          boxShadow="dark-lg"
          py="10px"
        >
          <VStack w={["100%", "100%", "50%"]} h="80vh">
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
              alignItems="center"
              overflowY="auto"
      
            >
              {data.length === 0 && (
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
              ) 
            
  

              }
              <VStack>
           {
              data.map((user) => (
    <Box key={user._id} boxShadow="dark-lg" w="300px" h="50px" rounded="10px" display="flex" alignItems="center" mt="10px" gap="50px" onClick={()=>handleselect(user._id)}    _hover={{ bgColor: "blue.200", color: "white" }} >
    <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' >
    <AvatarBadge boxSize='1em' bg='green.500' />
    </Avatar>
    <Text color="black" fontFamily="Arvo" ml="10px" w="100px">{user.name}</Text>
    <FiPhone bgColor="green.500"/>
    </Box>
  ))
           }
           </VStack>
            </Box>
          </VStack>
          <Box w={["100%", "100%", "50%"]} px="20px" py="10px">
            <VStack>
              <HStack w="100%">
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
                <Text fontFamily="Arvo" onClick={()=>handleSignout()}>SignOut</Text>
              </HStack>
              <Box w="100%" h="60vh" boxShadow="dark-lg" rounded="30px" isplay="flex">
              <Box  display="flex" justifyContent="flex" alignItems="flex">
                <Text fontFamily="Arvo">User Id :</Text>
              </Box>
              </Box>
            </VStack>
          </Box>
        </Box>
      </VStack>
    </>
  );
};

export default HomePage;
