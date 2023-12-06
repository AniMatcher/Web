import { Heading, Box, Text, Flex, Icon } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { BsArrowThroughHeartFill } from 'react-icons/bs';

import * as animation from '../components/animation';
import Layout from '../components/layout';

export default function Home() {
  const { status } = useSession();
  if (status === 'loading') {
    <Flex
      position="fixed"
      width="100vw"
      height="100vh"
      bgColor="#1a1a1a"
      animation={animation.hideAnimation}
      zIndex="3"
      alignItems="center"
      justifyContent="center"
    />;
  }
  return (
    <>
      <Flex
        position="fixed"
        width="100vw"
        height="100vh"
        bgColor="#1a1a1a"
        animation={animation.hideAnimation}
        zIndex="3"
        alignItems="center"
        justifyContent="center"
      >
        <Heading fontSize="5xl" textColor="white">
          <Flex animation={animation.coverAni}>
            <Text letterSpacing="-.1rem">AniMatcher</Text>
            <Icon as={BsArrowThroughHeartFill} />
          </Flex>
        </Heading>
      </Flex>
      <Box
        position="fixed"
        width="100vw"
        backgroundImage="/cute-anime-couple.jpg"
        backgroundPosition="center center"
        animation={animation.spinAnimation}
        zIndex="3"
      />
      <Box
        height="100vh"
        backgroundImage="/cute-anime-couple.jpg"
        backgroundPosition="center center"
      >
        <Box animation={animation.textAnimation}>
          <Layout>
            <Box
              className="back"
              position="absolute"
              zIndex="0"
              top="0"
              display="flex"
              alignContent="center"
              w="100vw"
              h="100vh"
            >
              <Flex
                bottom={0}
                p={{ base: 0, md: 6, lg: 10 }}
                width={{ base: '100%', md: '50%', lg: '45%', xl: '50%' }}
                left={0}
                justifyContent="center"
                textAlign={{ base: 'left', md: 'left' }}
                flexDir="column"
                alignContent={{ base: 'center', md: 'center' }}
              >
                <Heading ml={4} size={{ base: '2xl', md: '4xl' }} color="white">
                  Find your ハニー{' '}
                </Heading>
                <Text ml={4} mt={3} maxW="80%" fontSize="3xl" color="white">
                  Find love from what you love:
                </Text>
                <Heading ml={4} size={{ base: 'xl', md: '2xl' }} color="pink">
                  Anime!
                </Heading>
              </Flex>
            </Box>
          </Layout>
        </Box>
      </Box>
      <Box width="100vw" height="100vh">
        Add stuff here
      </Box>
    </>
  );
}
