import { Box, Flex, Heading, Text, Image } from '@chakra-ui/react';
import type { AnimationControls } from 'framer-motion';
import { motion } from 'framer-motion';

interface CardProps {
  image: string;
  username: string;
  bio: string;
  gender: string;
  animation: AnimationControls;
  variant: 'front' | 'back';
}

const ChakraBox = motion(Box);

export default function Card({
  image,
  username,
  bio,
  gender,
  animation,
  variant,
}: CardProps) {
  if (variant === 'front') {
    return (
      <ChakraBox
        w="360px"
        h="550px"
        border="1px solid black"
        position="absolute"
        minWidth="0"
        margin="auto"
        rounded="lg"
        bgColor="white"
        boxShadow="md"
        bgSize="cover"
        animate={animation}
      >
        <Image
          objectFit="cover"
          w="100%"
          h="100%"
          src={image || 'aot.jpeg'}
          userSelect="none"
        />
        <Flex
          w="100%"
          position="absolute"
          bottom="0"
          bgColor="gray.50"
          flexDirection="column"
          rounded="lg"
          p="3"
        >
          <Heading fontSize="2xl">
            {username},&nbsp;{gender}
          </Heading>
          <Text>{bio}</Text>
        </Flex>
      </ChakraBox>
    );
  }
  if (variant === 'back') {
    return (
      <ChakraBox
        w="360px"
        h="550px"
        border="1px solid black"
        position="absolute"
        minWidth="0"
        margin="auto"
        rounded="lg"
        bgColor="white"
        boxShadow="md"
        bgSize="cover"
        animate={animation}
      >
        <Flex m="4" flexDir="column">
          <Flex>
            <Heading fontSize="2xl">
              {username},&nbsp;{gender}
            </Heading>
            <Image />
          </Flex>

          <Text>{bio}</Text>
        </Flex>
      </ChakraBox>
    );
  }
}
