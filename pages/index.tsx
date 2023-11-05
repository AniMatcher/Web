import { Heading, Box, Spinner, Text, Flex } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

import Layout from '../components/layout';
import Swipes from '../components/swipes';

export default function Home() {
  const { status } = useSession();
  if (status === 'loading') {
    return (
      <Layout>
        <Flex align="center" justify="center">
          <Flex align="center" justify="center">
            <Spinner size="lg" />
          </Flex>
        </Flex>
      </Layout>
    );
  }
  if (status === 'authenticated') {
    return (
      <Layout>
        <Swipes />
      </Layout>
    );
  }
  return (
    <Box
      height="100vh"
      backgroundImage="/cute-anime-couple.jpg"
      backgroundPosition="center center"
    >
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
            <Heading ml={4} size={{ base: 'xl', md: '3xl' }} color="white">
              Anime
            </Heading>
          </Flex>
        </Box>
      </Layout>
    </Box>
  );
}
