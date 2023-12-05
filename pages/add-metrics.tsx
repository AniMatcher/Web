/* eslint-disable @typescript-eslint/ban-ts-comment */

'use client';

import {
  Box,
  Flex,
  NumberInput,
  FormControl,
  FormLabel,
  Text,
  NumberInputField,
  FormErrorMessage,
  AbsoluteCenter,
  useToast,
  Heading,
  Button,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { SiAnilist } from 'react-icons/si';
import * as Yup from 'yup';

import Layout from '../components/layout';

export default function Page() {
  const toast = useToast();
  const [submitB, SetsubmitB] = useState(false);
  const { push } = useRouter();
  const { status, data } = useSession();

  const signupSchema = Yup.object().shape({
    count: Yup.number().required().positive().integer(),
    meanScore: Yup.number().required().positive(),
    minutesWatched: Yup.number().required().positive().integer(),
    episodesWatched: Yup.number().required().positive().integer(),
  });

  if (status === 'loading') {
    return (
      <Layout>
        <Heading>Loading.....</Heading>
      </Layout>
    );
  }
  if (status === 'authenticated') {
    return (
      <Layout>
        <Box w="100%">
          <Box alignContent="center" alignItems="center" mx="auto" p={8}>
            <Heading>Add Metrics</Heading>
            <Flex direction="column">
              <Button
                my={8}
                _hover={{}}
                color="white"
                bg="#282d40"
                rightIcon={<Icon as={SiAnilist} color="#4ba6f8" />}
                size="lg"
                onClick={() => push('/api/anilist-push')}
              >
                Login With Anilist
              </Button>
              <Box position="relative" padding="10">
                <Divider borderColor="black" borderWidth="2px" />
                <AbsoluteCenter bg="white" px="4">
                  <Text fontWeight="extrabold">OR</Text>
                </AbsoluteCenter>
              </Box>
              <Flex mx="auto" maxW="lg" direction="column">
                <Formik
                  validationSchema={signupSchema}
                  initialValues={{
                    count: 0,
                    meanScore: 0.0,
                    minutesWatched: 0,
                    episodesWatched: 0,
                  }}
                  onSubmit={async (values) => {
                    const posData = {
                      uuid: data.uuid,
                      ...values,
                    };
                    const resp = await fetch(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/anilist/user/`,
                      {
                        method: 'POST',
                        headers: {
                          'Access-Control-Allow-Origin': '*',
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(posData),
                      }
                    );
                    SetsubmitB(false);
                    if (resp.status === 200) {
                      toast({
                        title: `Profile created!`,
                        description: "We've created your profile for you.",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                      });
                      push('/profile');
                    } else {
                      toast({
                        title: 'ERROR Occurred',
                        description: resp.statusText,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  {({
                    handleSubmit,
                    errors,
                    touched,
                    setFieldValue,
                    values,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <FormControl isInvalid={!!errors.count && touched.count}>
                        <FormLabel htmlFor="count">Count</FormLabel>
                        <NumberInput
                          onChange={(value) => setFieldValue('count', value)}
                          value={values.count}
                        >
                          <NumberInputField id="count" />
                        </NumberInput>
                        <FormErrorMessage>{errors.count}</FormErrorMessage>
                      </FormControl>
                      <FormControl
                        isInvalid={!!errors.meanScore && touched.meanScore}
                      >
                        <FormLabel htmlFor="meanScore">Mean Score</FormLabel>
                        <NumberInput
                          onChange={(value) =>
                            setFieldValue('meanScore', value)
                          }
                          value={values.meanScore}
                        >
                          <NumberInputField id="meanScore" />
                        </NumberInput>
                        <FormErrorMessage>{errors.meanScore}</FormErrorMessage>
                      </FormControl>
                      <FormControl
                        isInvalid={
                          !!errors.minutesWatched && touched.minutesWatched
                        }
                      >
                        <FormLabel htmlFor="minutesWatched">
                          Minutes Watched
                        </FormLabel>
                        <NumberInput
                          onChange={(value) =>
                            setFieldValue('minutesWatched', value)
                          }
                          value={values.minutesWatched}
                        >
                          <NumberInputField id="minutesWatched" />
                        </NumberInput>
                        <FormErrorMessage>
                          {errors.minutesWatched}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        isInvalid={
                          !!errors.episodesWatched && touched.episodesWatched
                        }
                      >
                        <FormLabel htmlFor="episodesWatched">
                          Episodes Watched
                        </FormLabel>
                        <NumberInput
                          onChange={(value) =>
                            setFieldValue('episodesWatched', value)
                          }
                          value={values.episodesWatched}
                        >
                          <NumberInputField id="episodesWatched" />
                        </NumberInput>
                        <FormErrorMessage>
                          {errors.episodesWatched}
                        </FormErrorMessage>
                      </FormControl>
                      <Button
                        isLoading={submitB}
                        size="lg"
                        bg="brand.200"
                        my={8}
                        type="submit"
                      >
                        Submit
                      </Button>
                    </form>
                  )}
                </Formik>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Layout>
    );
  }
  push('/login');
}
