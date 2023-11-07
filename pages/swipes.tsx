import { Box, Button, Flex, IconButton, Spinner } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaThumbsDown } from 'react-icons/fa';

import Layout from '../components/layout';
import Card from '../components/card';

type Profile = {
  id: string;
  uuid: string;
  username: string;
  gender: string;
  sex_pref: string;
  genre: string;
  bio: string;
};

type ProfileProps = {
  id: number;
  uuid: string;
  username: string;
  gender: string;
  sex_pref: string;
  genre: string;
  bio: string;
  image_urls: { [key: string]: string };
};

export default function Swipes() {
  const { data, status } = useSession();
  const [prof, setProfile] = useState<ProfileProps[]>([]); // Implement the swipe left and swipe right functions

  const fetchMatches = async () => {
    if (status === 'authenticated') {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/matches?uuid=${data.uuid}&num=5`,
          {
            method: 'GET',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        const profiles = await response.json();

        const fetches = profiles.map((promise: Profile) =>
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/uuid/${promise.uuid}`,
            {
              method: 'GET',
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
            }
          ).then((res) => res.json())
        );
        const profs = await Promise.all(fetches);
        const promises = profs.map((promise) => {
          return promise;
        });
        setProfile(promises); // Now we are setting the resolved values
        console.log(profs);
      } catch (err) {
        console.error('Request failed', err);
      }
    }
  };
  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <Layout>
      <Flex
        position="absolute"
        justify="center"
        align="center"
        h="100vh"
        w="100vw"
        top="0"
        bgColor="gray.50"
        flexDirection="column"
        gap="4"
      >
        <Flex w="360px" h="550px" justify="center" align="center">
          {prof.length <= 0 ? (
            <Spinner />
          ) : (
            prof.map((profile) => {
              return (
                <Card
                  image={profile.image_urls[Object.keys(profile.image_urls)[0]]}
                  username={profile.username}
                  bio={profile.bio}
                  gender={profile.gender}
                />
              );
            })
          )}
        </Flex>
        {prof.length > 0 && (
          <Flex
            boxShadow="lg"
            p="2"
            pl="4"
            pr="4"
            bgColor="brand.200"
            flexDirection="row"
            bottom="20px"
            gap="10"
            rounded="3xl"
          >
            <IconButton
              isRound
              aria-label="swipe-left"
              size="lg"
              icon={<AiFillHeart />}
              fontSize="3xl"
              color="rgb(108,222,171)"
              boxShadow="lg"
              _hover={{ bgColor: 'gray.100', transform: 'scale(1.3)' }}
              bgColor="gray.50"
            >
              swipe
            </IconButton>
            <IconButton
              isRound
              aria-label="swipe-right"
              size="lg"
              icon={<FaThumbsDown />}
              fontSize="2xl"
              color="red"
              boxShadow="lg"
              _hover={{ bgColor: 'gray.100', transform: 'scale(1.3)' }}
              bgColor="gray.50"
            >
              swipe
            </IconButton>
          </Flex>
        )}
      </Flex>
    </Layout>
  );
}
