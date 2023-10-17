import React from 'react'
import {Box, Center} from '@chakra-ui/react'





function HomePage() {

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    
    if (userInfoString) {
      try {
        const user = JSON.parse(userInfoString);
        // Check if user is valid JSON
        if (user && typeof user === 'object') {
          navigate(`/home`);
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
  }, []);



  return (
    <>
    <Center>
      <Box  w={["100%", "96%", "80%"]}
          h={["100%", "100%", "100%"]}
          display="flex"
          rounded="30px"
          boxShadow="dark-lg"
          my="30px"
          py="10px"
          justifyContent="center"
          alignItems="center"
          >
          
       Welcome
      </Box>
</Center>
    </>
  )
}

export default HomePage