import { Flex } from '@chakra-ui/react';

const Swipes = () => {
  // Reference to Typing Animation
  return (
    <Flex
      position="absolute"
      justify="center"
      align="center"
      h="100vh"
      w="100vw"
      top="0"
      bgColor="red"
    >
      <Flex justify="center" align="center">
        Hi
      </Flex>
    </Flex>
  );
};

export default Swipes;
