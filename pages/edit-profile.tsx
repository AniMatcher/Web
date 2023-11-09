/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import {
  Box,
  Button,
  Checkbox,
  useToast,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  VStack,
  Select,
  Heading,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import type { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import Layout from '../components/layout';

import { authOptions } from './api/auth/[...nextauth]';

function IndexPage({ data }: { data: Profile }) {
  const toast = useToast();
  const { push } = useRouter();

  return (
    <Layout>
      <Box mx="auto" m={4}>
        <Heading>Edit Profile</Heading>
        <Formik
          initialValues={{
            genderSelect: data.gender,
            malepref:
              data.sex_pref === 'A' ||
              data.sex_pref === 'D' ||
              data.sex_pref === 'E' ||
              data.sex_pref === 'G',
            femalepref:
              data.sex_pref === 'B' ||
              data.sex_pref === 'D' ||
              data.sex_pref === 'F' ||
              data.sex_pref === 'G',
            nonbinarypref:
              data.sex_pref === 'C' ||
              data.sex_pref === 'E' ||
              data.sex_pref === 'F' ||
              data.sex_pref === 'G',
            genre: data.genre,
            bio: data.bio,
          }}
          onSubmit={async (values) => {
            const valprefnum =
              64 +
              Number(values.malepref) +
              2 * Number(values.femalepref) +
              4 * Number(values.nonbinarypref);

            if (valprefnum <= 64) {
              toast({
                title: 'Please Select a preference',
                description:
                  'You cannot have no preferences, please select something so we know who to match you with',
                status: 'error',
                duration: 9000,
                isClosable: true,
              });
            } else {
              const postVal = {
                sex_pref: String.fromCharCode(valprefnum),
                username: data.username,
                gender: values.genderSelect,
                uuid: data.uuid,
                genre: values.genre,
                bio: values.bio,
              };
              // alert(JSON.stringify(post_val));
              const resp = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/edit-profile/`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(postVal),
                }
              );
              if (resp.status === 200) {
                toast({
                  title: `Profile Edited!`,
                  description: "We've edited your profile for you.",
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
            }
          }}
        >
          {({ handleSubmit, errors }) => (
            <form onSubmit={handleSubmit}>
              <VStack w="100%" m={5} spacing={4} align="flex-start">
                <FormControl isInvalid={!!errors.genderSelect}>
                  <FormLabel htmlFor="gendeSelect">Gender</FormLabel>
                  <Field
                    as={Select}
                    id="genderSelect"
                    name="genderSelect"
                    value={data.gender}
                    validate={(value: string) => {
                      let error;
                      if (value === 'Select') {
                        error = 'Select not valid gender';
                      }
                      return error;
                    }}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="NB">Nonbinary</option>
                  </Field>
                  <FormErrorMessage>{errors.genderSelect}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="preferences">Preferences</FormLabel>
                  <Flex>
                    <Box pr="6">
                      <Field
                        as={Checkbox}
                        id="malepref"
                        name="malepref"
                        colorScheme="orange"
                      >
                        Male
                      </Field>
                    </Box>
                    <Box pr="6">
                      <Field
                        as={Checkbox}
                        id="femalepref"
                        name="femalepref"
                        colorScheme="orange"
                      >
                        Female
                      </Field>
                    </Box>
                    <Box>
                      <Field
                        as={Checkbox}
                        id="nonbinarypref"
                        name="nonbinarypref"
                        colorScheme="orange"
                      >
                        Nonbinary
                      </Field>
                    </Box>
                  </Flex>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="biography">Bio</FormLabel>
                  <Field
                    as={Textarea}
                    id="bio"
                    name="bio"
                    type="text"
                    variant="filled"
                    placeholder="Tell me a bit about yourself."
                  />
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

type Profile = {
  id: string;
  uuid: string;
  username: string;
  gender: string;
  sex_pref: string;
  genre: string;
  bio: string;
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
    const response: Profile = await query.json();

    if (query.status === 200) {
      return {
        props: {
          data: {
            id: response.id,
            uuid: response.uuid,
            username: response.username,
            gender: response.gender,
            sex_pref: response.sex_pref,
            genre: response.genre,
            bio: response.bio,
          },
        },
      };
    }
    //   return {
    //     redirect: {
    //       permanent: true,
    //       destination: '/-profile',
    //     },
    //   };
    return {
      redirect: {
        permanent: true,
        destination: '/',
      },
    };
  }
  return {
    redirect: {
      permanent: true,
      destination: '/login',
    },
  };
};

const editProfile = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const profileData: Profile = data;
  return <IndexPage data={profileData} />;
};

export default editProfile;
