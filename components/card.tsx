import { Box, Flex, Heading, Text, Image, Avatar } from '@chakra-ui/react';
import type { AnimationControls } from 'framer-motion';
import { motion } from 'framer-motion';

interface CardProps {
  image: string;
  username: string;
  bio: string;
  gender: string;
  animation: AnimationControls;
  variant: 'front' | 'back';
  animes: string[];
}

const ChakraBox = motion(Box);

export default function Card({
  image,
  username,
  bio,
  gender,
  animation,
  variant,
  animes,
}: CardProps) {
  if (variant === 'front') {
    return (
      <ChakraBox
        w="100%"
        h="100%"
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
          draggable={false}
          loading="eager"
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
        w="100%"
        h="100%"
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
        <Flex m="4" flexDir="column" gap="2" overflow="hidden">
          <Flex flexDir="row" align="center" gap="2">
            <Avatar w="50px" h="50px" objectFit="cover" src={image} />
            <Heading fontSize="4xl">{username}</Heading>
          </Flex>

          <Text p="1" border="1px" rounded="lg" bgColor="brand.800">
            Gender: {gender}
          </Text>
          <Text p="1" border="1px" rounded="lg" bgColor="brand.800">
            Bio: {bio}
          </Text>
          <Text>Liked Animes:</Text>

          <Flex flexDir="row" flexWrap="wrap" gap="2">
            {animes.map((name, index) => {
              return index < 8 ? (
                <Image
                  draggable={false}
                  h="100px"
                  w="71px"
                  objectFit="cover"
                  src={name}
                />
              ) : null;
            })}
          </Flex>
        </Flex>
      </ChakraBox>
    );
  }
}
