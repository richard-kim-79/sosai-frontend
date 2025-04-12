import React from 'react';
import { ChakraProvider, Box, Heading, Container } from '@chakra-ui/react';
import Chat from './components/Chat';

function App() {
  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <Heading as="h1" size="xl" textAlign="center" mb={8}>
            SOSAI - 익명 기반 위기 대응 AI 챗봇
          </Heading>
          <Chat />
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
