import React, { useEffect, useState } from "react";
import { Box, Center, HStack, Text, VStack, Img,Avatar,AvatarBadge,Button} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import profile from "../profile.svg";
import axios  from "axios"

 

const HomePage = () =>{
  const navigate = useNavigate();
  const [data,setData]=useState([])
 
  console.log(Array.isArray(JSON.parse(data)));
 const f=0
  console.log(data)

  const handeluser=async()=>{
    const allusers=await axios.get("http://localhost:8000/api/use/users")
    const userdata=allusers.data
    setData(userdata)
   
  }

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
   
 
  

    if (userInfoString) {
      try {
        const user = JSON.parse(userInfoString);
        // Check if user is valid JSON
        if (user && typeof user === "object") {
          navigate(`/home`);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
        navigate("/");
      }
    } else {
      navigate("/"); 
    }
  }, []); 

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
          display={{base:"block",md:"flex"}}
          rounded="30px"
          boxShadow="dark-lg"
          py="10px"
        >
          <VStack w={["100%","100%","50%"]} h="80vh">
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
     
    
    
    >
    {data.length===0 ?
      <Button bgColor="green.500" color="white"  _hover={{ bgColor: "black", color: "white" }} onClick={()=>{handeluser()}}>
        See all users
      </Button>
      :
      f
      
}







    
    </Box>   
          </VStack>
          <Box  w={["100%","100%","50%"]} px="20px" py="10px">
            <VStack>
              <HStack w="100%" >
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
                <Text fontFamily="Arvo">SignOut</Text>
              </HStack>
              <Box w="100%" h="60vh"   boxShadow="dark-lg" rounded="30px">
                hi
              </Box>
            </VStack>
          </Box>
        </Box>
      </VStack>
    </>
  );
}

export default HomePage; 
 