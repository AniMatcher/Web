/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */

'use client';

import {
  Box,
  Button,
  Checkbox,
  useToast,
  Image,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  AlertIcon,
  AlertDescription,
  Textarea,
  VStack,
  Select,
  Alert,
  Heading,
  forwardRef,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as Yup from 'yup';

import Layout from '../components/layout';

export default function App() {
  const { status, data } = useSession();
  const toast = useToast();
  const { push } = useRouter();
  const [hasFile, SetFile] = useState<boolean | null>(null);
  const [filemessage, fileSetMessage] = useState('No File Yet');
  const [pfp, ChangePfp] = useState<null | string>(null);
  const [imgBase, setImageBase] = useState('');
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles?.[0];
    if (!file) {
      return;
    }
    fileSetMessage('Parsing File.....');
    SetFile(false);

    if (
      !['image/jpeg', 'image/jpg', 'image/png', 'image/heic'].includes(
        file.type
      )
    ) {
      fileSetMessage('Not valid image format');
      SetFile(false);
      return;
    }

    try {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onloadend = () => {
        const base64String = fr.result?.toString();
        setImageBase(base64String || 'ERROR');
      };
      // const buff = Buffer.from(await file.text());
      // const dataString = `data:${file.type};base64,${buff.toString('base64')}`;

      const filed = {
        blobUrl: URL.createObjectURL(file),
        name: `${file.name}_${Date.now()}`,
      };
      ChangePfp(filed.blobUrl);
      fileSetMessage(`Uploaded ${file.name}`);
      console.log(filed);
      SetFile(true);
    } catch (e) {
      fileSetMessage(e.message);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const MAX_SIZE = 50000000;

  if (status === 'loading') {
    return (
      <Layout>
        <Heading>Loading.....</Heading>
      </Layout>
    );
  }

  const signupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    genderSelect: Yup.string()
      .oneOf(['male', 'female', 'nonbinary', 'other'])
      .required(),
    genre: Yup.string().required(),
    bio: Yup.string().min(10, 'Bio too short').required(),
  });

  if (status === 'authenticated') {
    return (
      <Layout>
        <Box mx="auto" m={4}>
          <Heading>Create Profile</Heading>
          <Formik
            validationSchema={signupSchema}
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
              if (hasFile !== true) {
                toast({
                  title: 'You have not uploaded a profile picture',
                  description: 'You need a profile picture to make a profile',
                  status: 'error',
                  duration: 9000,
                  isClosable: true,
                });
              }

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
                  uuid: data.uuid,
                  genre: values.genre,
                  bio: values.bio,
                  image: imgBase,
                };
                console.log(postVal);
                console.log(imgBase);
                // alert(JSON.stringify(postVal));
                // const resp = await fetch(
                //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/new-user/`,
                //   {
                //     method: 'POST',
                //     headers: {
                //       'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(postVal),
                //   }
                // );
                // if (resp.status === 200) {
                //   toast({
                //     title: `Profile created!`,
                //     description: "We've created your profile for you.",
                //     status: 'success',
                //     duration: 9000,
                //     isClosable: true,
                //   });
                //   push('/add-anime');
                // } else {
                //   toast({
                //     title: 'ERROR Occurred',
                //     description: resp.statusText,
                //     status: 'error',
                //     duration: 9000,
                //     isClosable: true,
                //   });
                // }
              }
            }}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack w="100%" m={5} spacing={4} align="flex-start">
                  <Text>Profile Picture:</Text>
                  <Flex>
                    {hasFile === true && (
                      <Image mx={20} h={200} w={200} src={pfp} />
                    )}
                    <Flex
                      align="center"
                      justify="center"
                      bg="gray.100"
                      border="1px dashed"
                      borderColor="brand.200"
                      borderRadius="16px"
                      w="100%"
                      minW={30}
                      p={8}
                      h={20}
                      minH="100%"
                      cursor="pointer"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <Text>Drag Image Here</Text>
                      ) : (
                        <Text>Drag, or click to select Profile Picture</Text>
                      )}
                      )
                    </Flex>
                  </Flex>
                  <Alert
                    maxW="md"
                    status={hasFile ? 'success' : 'error'}
                    borderRadius={5}
                    m={2}
                  >
                    <AlertIcon />
                    <AlertDescription>{filemessage}</AlertDescription>
                  </Alert>
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
                  <FormControl isInvalid={!!errors.bio && touched.bio}>
                    <FormLabel htmlFor="bio">Bio</FormLabel>
                    <Field
                      as={Textarea}
                      id="bio"
                      name="bio"
                      type="text"
                      variant="filled"
                      placeholder="Tell me a bit about yourself."
                    />
                    <FormErrorMessage>{errors.bio}</FormErrorMessage>
                  </FormControl>
                  <Button size="lg" bg="brand.200" my={8} type="submit">
                    Create Profile
                  </Button>
                </VStack>
              </form>
            )}
          </Formik>
        </Box>
      </Layout>
    );
  }
  push('/login');
}
