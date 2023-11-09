// display existing profile
import {
  Flex,
  Image,
  Divider,
  Text,
  Card,
  CardBody,
  Box,
  Tooltip,
  Spacer,
  SimpleGrid,
  Heading,
  Link,
  Button,
} from '@chakra-ui/react';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { AiOutlineUser } from 'react-icons/ai';

import Layout from '../components/layout';

import { authOptions } from './api/auth/[...nextauth]';

// user, email, sexual pref, 10 animes you like, genre, profile picture, gender, Recommended Anime
const Page = ({ profile }: { profile: ProfileProps }) => {
  let gender = 'Female';
  if (profile.gender === 'M') {
    gender = 'Male';
  }

  return (
    <Layout>
      <Box mx="auto" p={4}>
        <Divider />
        <Flex p={2} flexDirection={{ base: 'column', md: 'row' }}>
          <Flex direction="column">
            {/** profile picture will be obtained through s3 bucket */}
            <Image
              src={profile.image_profile}
              alt="profile picture"
              width={300}
              height={300}
              marginRight={2}
              marginBottom={6}
            />
            <Card
              border="1px solid black"
              rounded="lg"
              bg="white"
              width="100%"
              marginBottom={6}
              marginRight={100}
            >
              <CardBody>
                <Heading fontSize={25}>{profile.username}</Heading>
                <Divider />
                <Flex
                  mt={6}
                  flexDirection="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <AiOutlineUser />
                  <Text colorScheme="blackAlpha" paddingLeft={1}>
                    {gender}
                  </Text>
                </Flex>
                <Text>
                  <b>Bio</b>
                </Text>
                <Divider />
                <Text>{profile.bio}</Text>
              </CardBody>
            </Card>
            <Flex justify="center">
              <Link href="/edit-profile">
                <Button bgColor="brand.200">Edit Profile</Button>
              </Link>
            </Flex>
          </Flex>

          <Spacer />
          <Flex
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Flex
              flexDirection="row"
              justifyContent="center"
              alignContent="center"
            >
              <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }}>
                {Object.keys(profile.image_urls).map((k: string) => (
                  <Tooltip label={k} aria-label="A tooltip">
                    <Image
                      key={k}
                      src={profile.image_urls[k]}
                      alt={k}
                      margin="5px"
                    />
                  </Tooltip>
                ))}
              </SimpleGrid>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
};

type ProfileProps = {
  id: number;
  uuid: string;
  username: string;
  gender: string;
  sex_pref: string;
  genre: string;
  bio: string;
  image_profile: string;
  image_urls: {
    [key: string]: string;
  };
};

export const getServerSideProps = (async (context) => {
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
      const response: ProfileProps = await query.json();
      return { props: { response } };
    }
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/login',
    },
  };
}) satisfies GetServerSideProps<{
  response: ProfileProps;
}>;

const profile = ({
  response,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const profileData: ProfileProps = response;
  return <Page profile={profileData} />;
};

export default profile;
