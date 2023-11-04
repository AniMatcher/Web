import { Heading, Box, Spinner, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

import Layout from '../components/layout';

export default function Home() {
  const { status } = useSession();
  if (status === 'loading') {
    return (
      <Layout>
        <Spinner size="lg" />
      </Layout>
    );
  }
  return (
    <Box h="100vh" backgroundImage="/cute-anime-couple.jpg" textAlign="center">
      <Layout>
        <Box textAlign="left" h="100vh">
          <Box
            bottom={0}
            p={{ base: 0, md: 6, lg: 10 }}
            width={{ base: '100%', md: '50%', lg: '45%', xl: '50%' }}
            left={0}
            marginY="50vh"
            justifyContent="center"
            textAlign={{ base: 'left', md: 'left' }}
            alignContent={{ base: 'center', md: 'center' }}
          >
            <Heading ml={4} size={{ base: '2xl', md: '4xl' }} color="white">
              Find your ハニー{' '}
            </Heading>
            <Text ml={4} mt={3} maxW="80%" fontSize="xl" color="white">
              AniMatcher Will help you find love based on the biggest green
              flag: anime
            </Text>
          </Box>
        </Box>
        <Box h="100vh" bg="red" />
        <Box h="100vh" bg="blue" />
      </Layout>
    </Box>
  );
}
