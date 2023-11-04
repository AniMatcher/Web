/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, Button, Heading } from '@chakra-ui/react';
import { getServerSession } from 'next-auth/next';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

import Layout from '../components/layout';

import { authOptions } from './api/auth/[...nextauth]';

export default function IndexPage() {
  const { data, status } = useSession();
  if (status === 'loading') return <h1> loading... please wait</h1>;
  if (status === 'authenticated') {
    return (
      <Layout>
        <Flex
          h="400px"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Flex
            rounded="lg"
            bg="gray.200"
            p={10}
            flexDirection="column"
            alignItems="center"
          >
            <Heading my={4}> Welcome {data?.user?.name || 'NO Name'}</Heading>
            <Button
              colorScheme="purple"
              onClick={() => {
                signOut();
              }}
            >
              Sign Out
            </Button>
          </Flex>
        </Flex>
      </Layout>
    );
  }
  return (
    <Layout>
      <Flex
        h="400px"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          rounded="lg"
          bg="gray.200"
          p={10}
          flexDirection="column"
          alignItems="center"
        >
          <Heading>Login</Heading>
          <Button
            my={5}
            leftIcon={<FcGoogle />}
            onClick={() => signIn('google')}
          >
            Sign In with Google
          </Button>
        </Flex>
      </Flex>
    </Layout>
  );
}

export const getServerSideProps = async (context: any) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: '/profile',
      },
    };
  }
  return {
    props: {
      login: false,
    },
  };
};
