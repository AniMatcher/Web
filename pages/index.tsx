import { Heading, Box, Button } from '@chakra-ui/react';
import Link from 'next/link';

import Layout from '../components/layout';

export default function Home() {
  return (
    <Layout>
      <Box textAlign="center">
        <Heading>Welcome to AniMatcher</Heading>
        <Link href="/login">
          <Button my={10} size="lg" colorScheme="purple">
            Login
          </Button>
        </Link>
      </Box>
    </Layout>
  );
}
