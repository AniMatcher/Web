/* eslint-disable no-empty */
import { Box, Flex, IconButton, Spinner } from '@chakra-ui/react';
import { useAnimation } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaThumbsDown } from 'react-icons/fa';
import { IoMdRefresh } from 'react-icons/io';

import Click from '../components/click';
import Layout from '../components/layout';

// type Profile = {
//   id: string;
//   uuid: string;
//   username: string;
//   gender: string;
//   sex_pref: string;
//   genre: string;
//   bio: string;
// };

type ProfileProps = {
  id: number;
  uuid: string;
  username: string;
  gender: string;
  sex_pref: string;
  genre: string;
  bio: string;
  image_profile: string;
  image_urls: string[];
};

export default function Swipes() {
  const { data, status } = useSession();
  const [prof, setProfile] = useState<ProfileProps[]>([]); // Implement the swipe left and swipe right functions
  const animationControl = useAnimation();
  const [disabledButton, setDisabled] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const tinderSlide = async (swipe: boolean) => {
    animationControl
      .start({
        x: swipe ? -200 : 200,
        rotate: swipe ? -45 : 45,
        opacity: 0,
        transition: { duration: 0.5 },
      })
      .then(() => {
        animationControl.start({
          x: 0,
          opacity: 1,
          rotate: 0,
          transition: { duration: 0 },
        });
        if (current < prof.length) {
          setCurrent(current + 1);
        }
      });
  };

  const likeUser = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/matches`, {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          // eslint-disable-next-line sonarjs/no-duplicate-string
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: data?.uuid,
          liked_uuid: prof[current].uuid,
        }),
      });
    } catch (err) {}
  };

  const fetchMatches = async () => {
    setProfile([]);
    setCurrent(0);
    if (status === 'authenticated') {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/matches?uuid=${data.uuid}&num=10`,
          {
            method: 'GET',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        const profiles: ProfileProps[] = await response.json();

        // const fetches = profiles.map((promise: Profile) =>
        //   fetch(
        //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/uuid/${promise.uuid}`,
        //     {
        //       method: 'GET',
        //       headers: {
        //         'Access-Control-Allow-Origin': '*',
        //         'Content-Type': 'application/json',
        //       },
        //     }
        //   ).then((res) => res.json())
        // );
        // const profs = await Promise.all(fetches);
        // const promises = profs.map((promise) => {
        //   return promise;
        // });
        setProfile(profiles); // Now we are setting the resolved values
      } catch (err) {}
    }
  };

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (disabledButton) {
      timer = setTimeout(() => {
        setDisabled(false);
      }, 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabledButton]);

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
        <Flex
          bg="gray.200"
          w="360px"
          h={{ base: 'md', '2xl': 'lg' }}
          justify="center"
          align="center"
          mt="100"
        >
          {prof.length <= 0 || current >= prof.length ? (
            <Box> No more matches </Box>
          ) : (
            <Click
              image={prof[current].image_profile}
              username={prof[current].username}
              bio={prof[current].bio}
              gender={prof[current].gender}
              animation={animationControl}
              animes={prof[current].image_urls}
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
            />
          )}
        </Flex>

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
            aria-label="swipe-right"
            size="lg"
            icon={<FaThumbsDown />}
            fontSize="2xl"
            color="red"
            boxShadow="lg"
            // eslint-disable-next-line sonarjs/no-duplicate-string
            _hover={{ bgColor: 'gray.100', transform: 'scale(1.3)' }}
            bgColor="gray.50"
            onClick={() => {
              setIsFlipped(false);
              tinderSlide(true);
              setDisabled(true);
            }}
            isDisabled={disabledButton}
          />
          <IconButton
            isRound
            aria-label="refresh-matches"
            size="lg"
            icon={<IoMdRefresh />}
            fontSize="4xl"
            color="red"
            boxShadow="lg"
            _hover={{ bgColor: 'gray.100', transform: 'scale(1.3)' }}
            bgColor="gray.50"
            onClick={() => {
              setIsFlipped(false);

              fetchMatches();
              setDisabled(true);
            }}
            isDisabled={disabledButton}
          />
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
            onClick={() => {
              setIsFlipped(false);
              likeUser();
              tinderSlide(false);
              setDisabled(true);
            }}
            isDisabled={disabledButton}
          />
        </Flex>
      </Flex>
    </Layout>
  );
}
