// display existing profile
import { Flex, Image, Divider, Text, Card, CardBody } from '@chakra-ui/react';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { AiOutlineUser } from 'react-icons/ai';

import { authOptions } from './api/auth/[...nextauth]';

// user, email, sexual pref, 10 animes you like, genre, profile picture, gender, Recommended Anime
const Page = ({ profile }: { profile: ProfileProps }) => {
  const imgSize = 125;
  let gender = 'Female';
  if (profile.gender === 'M') {
    gender = 'Male';
  }

  return (
    <Flex flexDirection="column">
      <Flex
        flexDirection="column"
        justifyContent="flex-end"
        bg="#530303"
        height="200px"
        color="white"
      >
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          gap={50}
        >
          {/** profile picture will be obtained through s3 bucket */}
          <Flex flexDirection="row" alignItems="flex-end">
            <Image
              src="/magflake.jpeg"
              alt="profile picture"
              width={150}
              height={150}
              marginRight={2}
              marginLeft={200}
              marginBottom={6}
            />
            <Text marginBottom={6} fontSize={25}>
              {profile.username}
            </Text>
          </Flex>
          <Flex>
            <Card bg="white" width="400px" marginBottom={6} marginRight={100}>
              <CardBody>
                <Flex
                  flexDirection="row"
                  justifyContent="flex-start"
                  alignContent="flex-end"
                >
                  <AiOutlineUser />
                  <Text colorScheme="blackAlpha" paddingLeft={1}>
                    {gender}
                  </Text>
                </Flex>
              </CardBody>

              <CardBody>
                <Text>
                  <b>Bio</b>
                </Text>
                <Divider />
                <Text>{profile.bio}</Text>
              </CardBody>
            </Card>
          </Flex>
        </Flex>
        <Flex />
      </Flex>
      <Flex
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Text width="500px" color="gray.400" fontSize={15}>
          <b>My Photos</b>
        </Text>
        <Flex flexDirection="row" justifyContent="center" alignContent="center">
          <Image
            src="horimiya.png"
            alt="horimiya"
            width={imgSize}
            height={imgSize}
            margin="5px"
          />
          <Image
            src="cowboybebop.png"
            alt="cowboybebop"
            width={imgSize}
            height={imgSize}
            margin="5px"
          />
          <Image
            src="aot.jpeg"
            alt="aot"
            width={imgSize}
            height={imgSize}
            margin="5px"
          />
          <Image
            src="demonslayer.jpeg"
            alt="demonslayer"
            width={imgSize}
            height={imgSize}
            margin="5px"
          />
        </Flex>
      </Flex>
    </Flex>
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
};

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/email/${session.user?.email}`;
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
