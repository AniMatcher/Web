import { Box, Flex, Heading, Text } from '@chakra-ui/react';

interface CardProps {
  image: string;
  username: string;
  bio: string;
  gender: string;
}

export default function Card({ image, username, bio, gender }: CardProps) {
  return (
    <Box
      w="360px"
      h="550px"
      position="absolute"
      minWidth="0"
      margin="auto"
      rounded="lg"
      bgColor="white"
      bgImage={image || 'aot.jpeg'}
      objectPosition="center center"
      boxShadow="md"
      bgSize="cover"
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
    </Box>
  );
}
