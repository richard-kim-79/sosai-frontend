import React from 'react'
import { Box } from '@chakra-ui/react'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <Box
      width="100vw"
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding="20px"
      bg="gray.50"
    >
      <ChatBot />
    </Box>
  )
}

export default App 