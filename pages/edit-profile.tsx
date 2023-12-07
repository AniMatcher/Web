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
// import { useDropzone } from 'react-dropzone';

import Layout from '../components/layout';

import { authOptions } from './api/auth/[...nextauth]';

const genreList = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Ecchi',
  'Fantasy',
  'Horror',
  'Mahou Shoujo',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
];

function IndexPage({ data }: { data: Profile }) {
  const toast = useToast();
  const { push } = useRouter();
  // const [hasFile, SetFile] = useState<boolean | null>(null);
  // const [filemessage, fileSetMessage] = useState('No File Yet');
  // const [pfp, ChangePfp] = useState<null | string>(null);
  // const [imgBase, setImageBase] = useState('');
  // const [imgFile, setImageFile] = useState('');

  // const onDrop = useCallback(async (acceptedFiles: File[]) => {
  //   const file = acceptedFiles?.[0];
  //   if (!file) {
  //     return;
  //   }
  //   fileSetMessage('Parsing File.....');
  //   SetFile(false);

  //   if (
  //     !['image/jpeg', 'image/jpg', 'image/png', 'image/heic'].includes(
  //       file.type
  //     )
  //   ) {
  //     fileSetMessage('Not valid image format');
  //     SetFile(false);
  //     return;
  //   }

  //   try {
  //     const fr = new FileReader();
  //     fr.readAsDataURL(file);
  //     fr.onloadend = () => {
  //       const base64String = fr.result?.toString();
  //       setImageBase(base64String || 'ERROR');
  //     };
  //     // const buff = Buffer.from(await file.text());
  //     // const dataString = `data:${file.type};base64,${buff.toString('base64')}`;

  //     const filed = {
  //       blobUrl: URL.createObjectURL(file),
  //       name: `${file.name}_${Date.now()}`,
  //     };
  //     ChangePfp(filed.blobUrl);
  //     setImageFile(filed.name);
  //     fileSetMessage(`Uploaded ${file.name}`);
  //     SetFile(true);
  //   } catch (e: any) {
  //     fileSetMessage(e.message);
  //   }
  // }, []);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Layout>
      <Box mx="auto" m={4}>
        <Heading>Edit Profile</Heading>
        <Formik
          initialValues={{
            genderSelect: data.gender,
            malepref:
              data.sex_pref === 'A' ||
              data.sex_pref === 'C' ||
              data.sex_pref === 'E' ||
              data.sex_pref === 'G',
            femalepref:
              data.sex_pref === 'B' ||
              data.sex_pref === 'C' ||
              data.sex_pref === 'F' ||
              data.sex_pref === 'G',
            nonbinarypref:
              data.sex_pref === 'D' ||
              data.sex_pref === 'E' ||
              data.sex_pref === 'F' ||
              data.sex_pref === 'G',
            genre: data.genre.length <= 1 ? 'Action' : data.genre,
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
                image: data.image_profile,
              };
              // alert(JSON.stringify(postVal));
              const resp = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/edit-profile/`,
                {
                  method: 'POST',
                  headers: {
                    'Access-Control-Allow-Origin': '*',
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
          {({ handleSubmit, errors }) => {
            return (
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
                  <FormControl isInvalid={!!errors.genre}>
                    <FormLabel htmlFor="genre">Genre</FormLabel>
                    <Field
                      as={Select}
                      placeholder="Select"
                      id="genre"
                      name="genre"
                      validate={(value: string) => {
                        let error;
                        if (value === 'Select') {
                          error = 'Select not valid genre';
                        }
                        return error;
                      }}
                    >
                      {genreList.map((itm) => (
                        <option>{itm}</option>
                      ))}
                    </Field>
                    <FormErrorMessage>{errors.genre}</FormErrorMessage>
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="preferences">Preferences</FormLabel>
                    <Flex gap="2">
                      <Field
                        as={Checkbox}
                        id="malepref"
                        name="malepref"
                        colorScheme="pink"
                        defaultChecked={
                          data.sex_pref === 'A' ||
                          data.sex_pref === 'C' ||
                          data.sex_pref === 'E' ||
                          data.sex_pref === 'G'
                        }
                      >
                        Male
                      </Field>
                      <Field
                        as={Checkbox}
                        id="femalepref"
                        name="femalepref"
                        colorScheme="pink"
                        defaultChecked={
                          data.sex_pref === 'B' ||
                          data.sex_pref === 'C' ||
                          data.sex_pref === 'F' ||
                          data.sex_pref === 'G'
                        }
                      >
                        Female
                      </Field>
                      <Field
                        as={Checkbox}
                        id="nonbinarypref"
                        name="nonbinarypref"
                        colorScheme="pink"
                        defaultChecked={
                          data.sex_pref === 'D' ||
                          data.sex_pref === 'E' ||
                          data.sex_pref === 'F' ||
                          data.sex_pref === 'G'
                        }
                      >
                        Nonbinary
                      </Field>
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
            );
          }}
        </Formik>
      </Box>
    </Layout>
  );
}

type Profile = {
  uuid: string;
  username: string;
  gender: string;
  sex_pref: string;
  genre: string;
  bio: string;
  image_profile: string;
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
    const response: Profile = (await query.json()).data;

    if (query.status === 200) {
      return {
        props: {
          data: {
            uuid: response.uuid,
            username: response.username,
            gender: response.gender,
            sex_pref: response.sex_pref,
            genre: response.genre,
            bio: response.bio,
            image_profile: response.image_profile,
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
