import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Spinner,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { io } from 'socket.io-client';
import axios from 'axios';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';

// ... existing code ... 