import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  useToast,
  Spinner,
  Badge,
} from '@chakra-ui/react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotionScore?: {
    anxiety: number;
    depression: number;
    anger: number;
    stress: number;
  };
  riskLevel?: 'LOW' | 'MID' | 'HIGH';
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const toast = useToast();

  useEffect(() => {
    const startChat = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/chat/start`);
        setChatId(response.data.chatId);
        setAnonymousId(response.data.anonymousId);
        setSessionToken(response.data.sessionToken);
        
        // WebSocket 연결
        socketRef.current = io(SOCKET_URL, {
          query: {
            chatId: response.data.chatId,
            anonymousId: response.data.anonymousId,
            sessionToken: response.data.sessionToken
          }
        });

        socketRef.current.on('message', (message: Message) => {
          setMessages(prev => [...prev, message]);
        });
      } catch (error) {
        toast({
          title: '채팅 시작 실패',
          description: '채팅을 시작하는 중 오류가 발생했습니다.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    startChat();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [toast]);

  const handleSendMessage = async () => {
    if (!input.trim() || !chatId) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/chat/message`, {
        chatId,
        message: input
      });

      setMessages(prev => [...prev, {
        role: 'user',
        content: input,
        timestamp: new Date()
      }, {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        emotionScore: response.data.emotionScore,
        riskLevel: response.data.riskLevel
      }]);

      setInput('');
    } catch (error) {
      toast({
        title: '메시지 전송 실패',
        description: '메시지를 전송하는 중 오류가 발생했습니다.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (level?: 'LOW' | 'MID' | 'HIGH') => {
    switch (level) {
      case 'HIGH':
        return 'red';
      case 'MID':
        return 'orange';
      case 'LOW':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Box maxW="800px" mx="auto" p={4}>
      <VStack spacing={4} align="stretch">
        <Box
          h="600px"
          borderWidth={1}
          borderRadius="lg"
          p={4}
          overflowY="auto"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              maxW="70%"
              mb={4}
            >
              <HStack spacing={2}>
                {message.role === 'assistant' && message.riskLevel && (
                  <Badge colorScheme={getRiskLevelColor(message.riskLevel)}>
                    {message.riskLevel}
                  </Badge>
                )}
                <Text
                  p={3}
                  borderRadius="lg"
                  bg={message.role === 'user' ? 'blue.500' : 'gray.100'}
                  color={message.role === 'user' ? 'white' : 'black'}
                >
                  {message.content}
                </Text>
              </HStack>
            </Box>
          ))}
          {isLoading && (
            <HStack justify="center" mt={4}>
              <Spinner />
            </HStack>
          )}
        </Box>
        <HStack>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            colorScheme="blue"
            onClick={handleSendMessage}
            isLoading={isLoading}
          >
            전송
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Chat; 