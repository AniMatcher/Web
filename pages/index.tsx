import { Heading, Box, Button, Spinner } from '@chakra-ui/react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

import Layout from '../components/layout';

export default function Home() {
  const { data, status } = useSession();
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
        <Box h="100vh" />
        <Box h="100vh" bg="red" />
        <Box h="100vh" bg="blue" />
      </Layout>
    </Box>
  );
}
