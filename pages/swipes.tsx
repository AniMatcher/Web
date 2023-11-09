import { Flex, IconButton, Spinner } from '@chakra-ui/react';
import { useAnimation } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaThumbsDown } from 'react-icons/fa';

import Card from '../components/card';
import Layout from '../components/layout';

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
  const animationControl = useAnimation();
  const [disabledButton, setDisabled] = useState(false);
  const [current, setCurrent] = useState(0);

  const tinderSlide = async (swipe: boolean) => {
    console.log(current);
    console.log(prof[current]);
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
        if (current < 4) {
          setCurrent(current + 1);
        }
      });
  };

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

        const fetchedData: ProfileProps[] = [];

        profiles.forEach(async (promise: Profile) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/uuid/${promise.uuid}`,
            {
              method: 'GET',
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
            }
          );
          const jsonData = await res.json();
          fetchedData.push(jsonData);
        });
        // const profs = await Promise.all(fetches);
        // const promises = profs.map((promise) => {
        //   return promise;
        // });
        setProfile(fetchedData); // Now we are setting the resolved values
        // console.log(profs);
      } catch (err) {
        console.error('Request failed', err);
      }
    }
  };
  useEffect(() => {
    fetchMatches();
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
        <Flex w="360px" h="550px" justify="center" align="center">
          {prof.length <= 0 || current >= prof.length - 1 ? (
            <Spinner />
          ) : (
            <Card
              image={
                prof[current].image_urls[
                  Object.keys(prof[current].image_urls)[0]
                ]
              }
              username={prof[current].username}
              bio={prof[current].bio}
              gender={prof[current].gender}
              animation={animationControl}
            />
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
              aria-label="swipe-right"
              size="lg"
              icon={<FaThumbsDown />}
              fontSize="2xl"
              color="red"
              boxShadow="lg"
              _hover={{ bgColor: 'gray.100', transform: 'scale(1.3)' }}
              bgColor="gray.50"
              onClick={() => {
                tinderSlide(true);
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
                tinderSlide(false);
                setDisabled(true);
              }}
              isDisabled={disabledButton}
            />
          </Flex>
        )}
      </Flex>
    </Layout>
  );
}
