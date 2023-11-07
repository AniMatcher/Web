import { Box, Button, Flex, IconButton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaThumbsDown } from 'react-icons/fa';

interface SwipesProps {
  email: string | null | undefined;
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

type Email = {
  id: string;
  uuid: string;
  username: string;
  gender: string;
  sex_pref: string;
  genre: string;
  bio: string;
  image_urls: Map<string, string>;
};

const Swipes = ({ email }: SwipesProps) => {
  const [prof, setProfile] = useState<Promise<Email>[]>(); // Implement the swipe left and swipe right functions

  const fetchMatches = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/matches?email=${email}&num=5`,
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
      setProfile(profs); // Now we are setting the resolved values
      console.log(profs);
    } catch (err) {
      console.error('Request failed', err);
    }
  };
  useEffect(() => {
    // fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex
      position="absolute"
      justify="center"
      align="center"
      h="100vh"
      w="100vw"
      top="0"
      bgColor="brand.900"
      flexDirection="column"
      gap="4"
    >
      <Flex w="360px" h="550px" justify="center" align="center">
        <Box
          w="360px"
          h="550px"
          position="absolute"
          minWidth="0"
          margin="auto"
          rounded="lg"
          bgColor="white"
          bgImage="https://cdn.myanimelist.net/images/anime/1208/94745.jpg"
          objectPosition="center center"
          boxShadow="lg"
        ></Box>
      </Flex>
      <Flex flexDirection="row" bottom="20px" gap="10">
        <IconButton
          isRound={true}
          aria-label="swipe-left"
          size="lg"
          icon={<AiFillHeart />}
          fontSize="3xl"
          color="rgb(108,222,171)"
          boxShadow="lg"
          _hover={{ transform: 'scale(1.3)' }}
        >
          swipe
        </IconButton>
        <IconButton
          isRound={true}
          aria-label="swipe-right"
          size="lg"
          icon={<FaThumbsDown />}
          fontSize="2xl"
          color="red"
          boxShadow="lg"
          _hover={{ transform: 'scale(1.3)' }}
        >
          swipe
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default Swipes;
