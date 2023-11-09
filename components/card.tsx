import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import type { AnimationControls } from 'framer-motion';
import { motion } from 'framer-motion';

interface CardProps {
  image: string;
  username: string;
  bio: string;
  gender: string;
  animation: AnimationControls;
}

const ChakraBox = motion(Box);

export default function Card({
  image,
  username,
  bio,
  gender,
  animation,
}: CardProps) {
  return (
    <ChakraBox
      w="360px"
      h="550px"
      position="absolute"
      minWidth="0"
      margin="auto"
      rounded="lg"
      bgColor="white"
      bgImage={image || 'aot.jpeg'}
      boxShadow="md"
      bgSize="cover"
      animate={animation}
    >
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
