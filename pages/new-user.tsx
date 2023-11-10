/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import {
  Button,
  Heading,
  FormControl,
  Input,
  FormLabel,
  VStack,
  FormErrorMessage,
  useToast,
  Box,
} from '@chakra-ui/react';
import { createHash } from 'crypto';
import { Formik, Field } from 'formik';
import type { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import Layout from '../components/layout';
import supabase from '../utils/supabase';

import { authOptions } from './api/auth/[...nextauth]';

function IndexPage({ data }: { data: NewUserProps }) {
  const toast = useToast();
  const router = useRouter();
  return (
    <Layout>
      <Box mx="auto" m={4}>
        <Heading>Onboarding</Heading>

        <Formik
          initialValues={{
            email: data.email,
            username: '',
            password: '',
          }}
          onSubmit={async (values) => {
            const hash = createHash('sha256')
              .update(values.password)
              .digest('hex');
            if (data.email) {
              const resp = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/`,
                {
                  method: 'POST',
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: data.email.toString(),
                    username: values.username,
                    password_hash: hash,
                  }),
                }
              );
              if (resp.status === 200) {
                toast({
                  title: `Account created!`,
                  description: "We've created your account for you.",
                  status: 'success',
                  duration: 9000,
                  isClosable: true,
                });
                router.push('/new-profile');
              } else {
                toast({
                  title: 'ERROR Occurred',
                  description: resp.statusText,
                  status: 'error',
                  duration: 9000,
                  isClosable: true,
                });
              }
            } else {
              toast({
                title: 'ERROR Occurred',
                description:
                  'There is no email. Trolling is happening. Contact us',
                status: 'error',
                duration: 9000,
                isClosable: true,
              });
            }
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <VStack w="100%" m={5} spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    variant="filled"
                    disabled
                    value={data.email || 'ERROR'}
                  />
                </FormControl>
                <FormControl isInvalid={!!errors.username && touched.username}>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Field
                    as={Input}
                    id="username"
                    name="username"
                    variant="filled"
                    validate={async (value: string) => {
                      let error;

                      if (value.length < 6) {
                        error = 'Username must contain at least 6 characters';
                      } else {
                        const { data: supadata } = await supabase
                          .from('auth')
                          .select('username')
                          .eq('username', value);
                        if ((supadata?.length || 0) >= 1) {
                          error =
                            'username already picked, please chose a new one';
                        }
                      }

                      return error;
                    }}
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.password && touched.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    variant="filled"
                    validate={(value: string) => {
                      let error;

                      if (value.length < 6) {
                        error = 'Password must contain at least 6 characters';
                      }

                      return error;
                    }}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <Button size="lg" bg="brand.200" my={8} type="submit">
                  Submit
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
      </Box>
    </Layout>
  );
}

type NewUserProps = {
  email: string;
};

export const getServerSideProps = async (context: any) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/uuid/${session.uuid}`;
    const query = await fetch(url, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    if (query.status === 200) {
      return {
        redirect: {
          permanent: true,
          destination: '/login',
        },
      };
    }
    if (session.user?.email) {
      return {
        props: {
          data: {
            email: session.user?.email || 'error',
          },
        },
      };
    }
    return {
      redirect: {
        permanent: true,
        destination: '/error',
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/login',
    },
  };
};

const NewUserPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const profileData: NewUserProps = data;
  return <IndexPage data={profileData} />;
};

export default NewUserPage;
