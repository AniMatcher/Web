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
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Layout from '../components/layout';

export default function App() {
  const { status, data } = useSession();
  const toast = useToast();
  const { push } = useRouter();
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
        <Heading>Create Profile</Heading>
        <Formik
          initialValues={{
            email: data.user?.email,
            genderSelect: 'Select',
            malepref: false,
            femalepref: false,
            nonbinarypref: false,
            genre: 'Shonen',
            bio: '',
            pref: 0,
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
              let genderM;
              switch (values.genderSelect) {
                case 'male':
                  genderM = 'M';
                  break;
                case 'female':
                  genderM = 'F';
                  break;
                case 'nonbinary':
                  genderM = 'NB';
                  break;
                default:
                  genderM = 'OOP';
                  break;
              }
              const postVal = {
                sex_pref: String.fromCharCode(valprefnum),
                gender: genderM,
                email: values.email,
                genre: values.genre,
                bio: values.bio,
              };
              // alert(JSON.stringify(post_val));
              const resp = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/new-user/`,
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
                  title: `Profile created!`,
                  description: "We've created your profile for you.",
                  status: 'success',
                  duration: 9000,
                  isClosable: true,
                });
                push('/add-anime');
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
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <VStack w="100%" m={5} spacing={4} align="flex-start">
                <FormControl
                  isInvalid={!!errors.genderSelect && touched.genderSelect}
                >
                  <FormLabel htmlFor="gendeSelect">Gender</FormLabel>
                  <Field
                    as={Select}
                    placeholder="Select"
                    id="genderSelect"
                    name="genderSelect"
                    validate={(value: string) => {
                      let error;
                      if (value === 'Select') {
                        error = 'Select not valid gender';
                      }
                      return error;
                    }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="nonbinary">Nonbinary</option>
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
                        colorScheme="purple"
                      >
                        Male
                      </Field>
                    </Box>
                    <Box pr="6">
                      <Field
                        as={Checkbox}
                        id="femalepref"
                        name="femalepref"
                        colorScheme="purple"
                      >
                        Female
                      </Field>
                    </Box>
                    <Box>
                      <Field
                        as={Checkbox}
                        id="nonbinarypref"
                        name="nonbinarypref"
                        colorScheme="purple"
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
                <Button my={8} type="submit" colorScheme="purple" width="full">
                  Login
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
      </Layout>
    );
  }
  push('/login');
}
