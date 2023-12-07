/* eslint-disable no-empty */
import { Box, Flex, IconButton, Image } from '@chakra-ui/react';
import { useAnimation } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaThumbsDown } from 'react-icons/fa';
import { IoMdRefresh } from 'react-icons/io';

import Click from '../components/click';
import Layout from '../components/layout';

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

let prof: ProfileProps[] = [];

export default function Swipes() {
  const { data, status } = useSession();
  const animationControl = useAnimation();
  const [disabledButton, setDisabled] = useState(false);
  const [updated, setUpdated] = useState(false);
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
          liked_uuid: prof[0].uuid,
        }),
      });
    } catch (err) {}
  };

  const fetchMatches = async () => {
    if (status === 'authenticated') {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/matches?uuid=${data.uuid}&num=7`,
          {
            method: 'GET',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        const profiles: ProfileProps[] = await response.json();
        prof = prof.concat(profiles);
        setUpdated(true);
      } catch (err) {}
    }
  };

  useEffect(() => {
    if (prof.length < 3) {
      fetchMatches();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prof.length]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMatches();
    }

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
        flexDirection="column"
        gap="4"
      >
        <Flex
          bgColor={prof.length <= 0 ? 'gray.200' : 'white'}
          rounded="3xl"
          w="360px"
          h={{ base: 'md', '2xl': 'lg' }}
          justify="center"
          align="center"
          mt="100"
        >
          {prof.length <= 0 || !updated ? (
            <Box fontSize="3xl" fontWeight="bold" textAlign="center">
              Come back for more matches
            </Box>
          ) : (
            <Click
              image={prof[0].image_profile}
              username={prof[0].username}
              bio={prof[0].bio}
              gender={prof[0].gender}
              animation={animationControl}
              animes={prof[0].image_urls}
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
            />
          )}
          {prof.length > 1 && (
            <Image src={prof[1].image_profile} loading="eager" hidden />
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
              setTimeout(() => {
                prof.shift();
              }, 150);
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
              setTimeout(() => {
                prof.shift();
              }, 150);
              setDisabled(true);
            }}
            isDisabled={disabledButton}
          />
        </Flex>
      </Flex>
    </Layout>
  );
}
