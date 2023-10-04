'use client';

import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Textarea,
  Input,
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
      <Flex bg="white" align="center" justify="center" h="100vh">
        <Box bg="gray.50" p={6} rounded="md" w="80rem">
          <Formik
            initialValues={{
              email: '',
              password: '',
              genderSelect: 'Select',
              malepref: false,
              femalepref: false,
              nonbinarypref: false,
              pref: 0,
            }}
            onSubmit={(values) => {
              values.pref =
                Number(values.malepref) +
                2 * Number(values.femalepref) +
                4 * Number(values.nonbinarypref);
              alert(JSON.stringify(values, null, 2));
            }}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="flex-start">
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
                  <Button type="submit" colorScheme="purple" width="full">
                    Login
                  </Button>
                </VStack>
              </form>
            )}
          </Formik>
        </Box>
      </Flex>
    );
  }
  push('/login');
}
