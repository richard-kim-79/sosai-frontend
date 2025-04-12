import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
} from '@chakra-ui/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  return (
    <VStack spacing={4} h="100%" p={4}>
      <Box flex={1} w="100%" overflowY="auto">
        {messages.map(message => (
          <Box
            key={message.id}
            bg={message.sender === 'user' ? 'blue.100' : 'gray.100'}
            p={2}
            borderRadius="md"
            mb={2}
          >
            <Text>{message.text}</Text>
          </Box>
        ))}
      </Box>
      <Box w="100%">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="메시지를 입력하세요..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} mt={2}>
          전송
        </Button>
      </Box>
    </VStack>
  );
};

export default Chat; 