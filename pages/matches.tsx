/* eslint-disable no-nested-ternary */
/* eslint-disable no-empty */
import {
  Avatar,
  Image,
  Box,
  Flex,
  Text,
  Menu,
  Icon,
  HStack,
  Input,
  MenuButton,
  useToast,
  Portal,
  MenuList,
  MenuItem,
  Heading,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import { useAnimation } from 'framer-motion';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaThumbsDown } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';

import Card from '../components/card';
import Layout from '../components/layout';

import { authOptions } from './api/auth/[...nextauth]';

type Profile = {
  id: string;
  uuid: string;
  username: string;
  gender: string;
  sex_pref: string;
  genre: string;
  bio: string;
  image_profile: string;
};

type ProfileChat = {
  id: string;
  uuid: string;
  username: string;
  gender: string;
  sex_pref: string;
  genre: string;
  bio: string;
  image_profile: string;
  chat_id: string;
};

type MatchProps = {
  my_uid: string;
  matches: Profile[];
  chats: ProfileChat[];
};

type ChatWindowProps = {
  user_uid: string;
  chat_id: string;
};

function ChatWindow({ user_uid, chat_id }: ChatWindowProps) {
  return (
    <Box w="100%" h="100%">
      <Flex w="100%" h="90%" flexGrow={1} overflowY="scroll" direction="column">
        <Text>{chat_id}</Text>
      </Flex>

      <Flex p={4}>
        <Input rounded="lg" bg="white" bottom={0} />
        <IconButton
          ml={2}
          rounded="lg"
          bg="brand.100"
          color="white"
          _hover={{}}
          aria-label="send-message"
          icon={<Icon as={IoSend} />}
        />
      </Flex>
    </Box>
  );
}

function Matches({ matches }: { matches: MatchProps }) {
  const toast = useToast();
  const [activeChat, SetActiveChat] = useState('');
  const [chatMsg, SetChatMsg] = useState('');
  const [loadingChat, SetLoadingChat] = useState(false);

  useEffect(() => {
    if (activeChat != '') {
      SetLoadingChat(false);
      SetChatMsg(`Get messages for chat_id ${activeChat}`);
    }
  }, [activeChat]);

  return (
    <Layout>
      <Flex p={4} top="0" flexDirection="column" gap="4">
        <Heading>Matches:</Heading>
        <Flex flexShrink={0} w="100%" overflowX="scroll">
          {matches.matches.map((itm) => (
            <Box cursor="crosshair" minW={{ base: '50%', md: '10%' }}>
              <Menu>
                <MenuButton
                  my={1}
                  textAlign="center"
                  shadow="lg"
                  rounded="lg"
                  mx={4}
                >
                  <Image
                    rounded="lg"
                    h={150}
                    w={150}
                    src={itm.image_profile}
                    alt={itm.username}
                  />
                  <Text fontWeight="bold" my={1}>
                    {itm.username}
                  </Text>
                </MenuButton>
                <Portal>
                  <MenuList>
                    <MenuItem>Unmatch</MenuItem>
                    <MenuItem
                      onClick={async () => {
                        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/chat/`;
                        const query = await fetch(url, {
                          body: JSON.stringify({
                            user_a: matches.my_uid,
                            user_b: itm.uuid,
                          }),
                          method: 'POST',
                          headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json',
                          },
                        });
                        if (query.status === 200) {
                          toast({
                            title: `Chat Created`,
                            description: 'Start Chatting with user now!',
                            status: 'success',
                            duration: 9000,
                            isClosable: true,
                          });
                          window.location.reload();
                        } else {
                          toast({
                            title: 'ERROR Occurred',
                            description: 'Unable to make chat with user',
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                          });
                        }
                      }}
                    >
                      Create Chat
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          ))}
        </Flex>
        <Heading p={2} border="1px solid black">
          Chat:
        </Heading>
        <Flex mt={-4} border="1px solid black" flexShrink={0} w="100%" h="75vh">
          <Flex
            overflowY="scroll"
            border="1px solid black"
            minW="20%"
            display="column"
          >
            {matches.chats.map((itm) => (
              <Flex
                onClick={() => {
                  SetActiveChat(itm.chat_id);
                  SetLoadingChat(true);
                }}
                border="1px solid black"
                p={4}
                alignItems="center"
              >
                <Avatar mx={2} size="lg" src={itm.image_profile} />
                <Text fontWeight="bold">{itm.username}</Text>
              </Flex>
            ))}
          </Flex>
          <Flex border="1px solid black" bg="gray.200" w="80%">
            {loadingChat ? (
              <Spinner size="xl" />
            ) : activeChat !== '' ? (
              <ChatWindow chat_id={activeChat} user_uid={matches.my_uid} />
            ) : (
              <br />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
}

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/mutuals-with-chats/?uuid=${session.uuid}`;
    const query = await fetch(url, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    console.log(query);
    if (query.status === 200) {
      const responseData = await query.json();
      console.log(responseData.matches);
      const parsed_data_arr: Profile[] = responseData.matches;
      const chat_data: ProfileChat[] = responseData.chats;
      console.log(parsed_data_arr);

      return {
        props: {
          response: {
            my_uid: session.uuid,
            matches: parsed_data_arr,
            chats: chat_data,
          },
        },
      };
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
  response: MatchProps;
}>;

const match = ({
  response,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const profileData: MatchProps = response;
  return <Matches matches={profileData} />;
};

export default match;
