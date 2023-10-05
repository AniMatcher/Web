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
} from '@chakra-ui/react';
import { createHash } from 'crypto';
import { Formik, Field } from 'formik';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import Layout from '../components/layout';
import supabase from '../utils/supabase';

export default function IndexPage() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const search = searchParams.get('email');

  return (
    <Layout>
      <Heading>Onboarding</Heading>

      <Formik
        initialValues={{
          email: search,
          username: '',
          password: '',
        }}
        onSubmit={async (values) => {
          const hash = createHash('sha256')
            .update(values.password)
            .digest('hex');
          if (search) {
            const resp = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: search.toString(),
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
              signIn('google', { callbackUrl: '/new-profile' });
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
                  value={search || 'ERROR'}
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
                      const { data } = await supabase
                        .from('auth')
                        .select('username')
                        .eq('username', value);
                      if ((data?.length || 0) >= 1) {
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
              <Button my={8} type="submit">
                Submit
              </Button>
            </VStack>
          </form>
        )}
      </Formik>
    </Layout>
  );
}
