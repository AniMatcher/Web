'use client';

import {
  Box,
  Flex,
  Spacer,
  Text,
  SimpleGrid,
  Input,
  Image,
  useToast,
  Heading,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import Layout from '../components/layout';
import supabase from '../utils/supabase';

type AnimeSearch = {
  aid: number;
  anime_id: number;
  anime_name: string;
  image_url: string;
};

export default function Page() {
  const [autoCompleteRes, SetAutoCompleteRes] = useState<AnimeSearch[]>([]);
  const [highlightAnime, SetHighlightAnime] = useState<AnimeSearch[]>([]);
  const toast = useToast();
  const { push } = useRouter();
  const { status, data } = useSession();

  if (status === 'loading') {
    return (
      <Layout>
        <Heading>Loading.....</Heading>
      </Layout>
    );
  }
  if (status === 'authenticated') {
    return (
      <Layout>
        <Flex>
          <Box w="50%">
            <Heading>Search</Heading>
            <Input
              my={5}
              size="lg"
              onChange={async (e) => {
                const { data, error } = await supabase.rpc(
                  'anime_autocomplete_search',
                  { query: e.target.value }
                );
                if (!error) {
                  SetAutoCompleteRes(data);
                }
              }}
            />
            <Box>
              {autoCompleteRes.map((v: AnimeSearch) => (
                <Flex
                  my={1}
                  p={4}
                  onClick={() => {
                    if (!highlightAnime.includes(v)) {
                      SetHighlightAnime(highlightAnime.concat([v]));
                    }
                  }}
                  borderWidth="1px"
                  borderRadius="lg"
                  alignItems="center"
                >
                  <Image
                    height={20}
                    width={20}
                    src={v.image_url}
                    alt="anime text"
                  />
                  <Text fontSize="xl" mx={4} size="xl">
                    {v.anime_name}
                  </Text>
                </Flex>
              ))}
            </Box>
          </Box>
          <Box p={2} h="100%" borderLeft="4px" mx={8} w="100%">
            <Flex>
              <Heading>My Anime</Heading>
              <Spacer />
              <Button
                onClick={() => SetHighlightAnime([])}
                ml={4}
                size="lg"
                colorScheme="purple"
              >
                Clear
              </Button>
              <Button
                onClick={async () => {
                  if (highlightAnime.length < 5 || highlightAnime.length > 10) {
                    toast({
                      title: 'Cannot add animes',
                      description: 'Please select between 5 and 10 anime',
                      status: 'warning',
                      duration: 9000,
                      isClosable: true,
                    });
                  } else {
                    const post_data = {
                      email: data?.user?.email || 'error',
                      animes: highlightAnime.map((elm) => elm.aid),
                    };
                    const resp = await fetch(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/animes/`,
                      {
                        method: 'POST',
                        headers: {
                          'Access-Control-Allow-Origin': '*',
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(post_data),
                      }
                    );
                    if (resp.status === 200) {
                      toast({
                        title: `Profile created!`,
                        description: "We've created your profile for you.",
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
                ml={4}
                size="lg"
                colorScheme="purple"
              >
                Submit
              </Button>
            </Flex>
            <Text>
              Anime on this list will be used to recommend others. Select 5-10
              Anime you like.
            </Text>
            <SimpleGrid columns={2} spacing={10}>
              {highlightAnime.map((elm: AnimeSearch) => (
                <Flex
                  my={1}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  alignItems="center"
                >
                  <Image
                    height={40}
                    width={40}
                    src={elm.image_url}
                    alt="anime text"
                  />
                  <Flex w="100%">
                    <Box>
                      <Flex mx={4} alignItems="center">
                        <Text fontSize="xl" fontWeight={800}>
                          ID:
                        </Text>{' '}
                        <Text fontSize="xl" size="xl">
                          {elm.anime_id}
                        </Text>
                      </Flex>
                      <Text fontSize="xl" mx={4} size="xl">
                        {elm.anime_name}
                      </Text>
                    </Box>
                    <Spacer />
                    <Button
                      onClick={() => {
                        SetHighlightAnime(
                          highlightAnime.filter((item) => item !== elm)
                        );
                      }}
                    >
                      X
                    </Button>
                  </Flex>
                </Flex>
              ))}
            </SimpleGrid>
          </Box>
        </Flex>
      </Layout>
    );
  }
  push('/login');
}