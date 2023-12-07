/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-empty */
import {
  Avatar,
  Image,
  Box,
  Flex,
  SimpleGrid,
  Text,
  Menu,
  Icon,
  Input,
  MenuButton,
  useToast,
  Portal,
  MenuList,
  MenuItem,
  Heading,
  Spinner,
  IconButton,
  Spacer,
} from '@chakra-ui/react';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';

import Layout from '../components/layout';
import supabase from '../utils/supabase';

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

type Message = {
  chat_uid: string;
  author_id: string;
  text: string;
};

type ChatWindowProps = {
  user_uid: string;
  chat_id: string;
  chatMsg: {
    data: Message[];
  };
};

function ChatWindow({ user_uid, chat_id, chatMsg }: ChatWindowProps) {
  const [text, SetText] = useState('');

  return (
    <Flex direction="column" p={4} w="100%" h="100%">
      <SimpleGrid columns={2} w="100%" flexGrow={1} overflowY="scroll">
        {chatMsg.data.map((i) => (
          <>
            {i.author_id === user_uid && <Box />}
            <Box
              rounded="lg"
              w={{ base: '100%', md: '50%' }}
              alignContent={
                i.author_id === user_uid ? 'flex-end' : 'flex-start'
              }
              p={4}
              my={4}
              color="black"
              bg={i.author_id === user_uid ? 'brand.200' : 'brand.800'}
            >
              <Text>{i.text}</Text>
            </Box>
            {i.author_id !== user_uid && <Box />}
          </>
        ))}
        <Box />
      </SimpleGrid>
      <Spacer />
      <Flex p={{ base: 0, md: 4 }}>
        <Input
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await supabase.from('messages').insert([
                {
                  text,
                  chat_id,
                  author_id: user_uid,
                },
              ]);
              SetText('');
            }
          }}
          value={text}
          onChange={(e) => SetText(e.target.value)}
          rounded="lg"
          bg="white"
          bottom={0}
        />
        <IconButton
          onClick={async () => {
            await supabase.from('messages').insert([
              {
                text,
                chat_id,
                author_id: user_uid,
              },
            ]);
            SetText('');
          }}
          ml={2}
          rounded="lg"
          bg="brand.100"
          color="white"
          _hover={{}}
          aria-label="send-message"
          icon={<Icon as={IoSend} />}
        />
      </Flex>
    </Flex>
  );
}

function Matches({ matches }: { matches: MatchProps }) {
  const toast = useToast();
  const [activeChat, SetActiveChat] = useState('');
  const [chatMsg, SetChatMsg] = useState<null | any>(null);
  const [loadingChat, SetLoadingChat] = useState(false);

  useEffect(() => {
    async function getAllMessages() {
      return supabase.from('messages').select('*').eq('chat_id', activeChat);
    }

    async function main() {
      const msgs = await getAllMessages();
      SetChatMsg(msgs);
      const messagesWatcher = supabase
        .channel('custom-all-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'messages' },
          async () => {
            const m = await getAllMessages();
            SetChatMsg(m);
          }
        )
        .subscribe();
      SetLoadingChat(false);
      // SetChatMsg(`Get messages for chat_id ${activeChat}`);
    }
    if (activeChat !== '') {
      main();
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
        <Flex
          direction={{ base: 'column', md: 'row' }}
          mt={-4}
          border="1px solid black"
          flexShrink={0}
          w="100%"
          h="75vh"
        >
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
          <Flex
            border="1px solid black"
            bg="gray.200"
            w={{ base: '100%', md: '80%' }}
          >
            {loadingChat ? (
              <Spinner size="xl" />
            ) : activeChat !== '' ? (
              <Box minH="100%" minW={{ base: '100%', md: '80%' }}>
                <ChatWindow
                  chatMsg={chatMsg}
                  chat_id={activeChat}
                  user_uid={matches.my_uid}
                />
              </Box>
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
    if (query.status === 200) {
      const responseData = await query.json();
      const parsedDataArr: Profile[] = responseData.matches;
      const chatData: ProfileChat[] = responseData.chats;

      return {
        props: {
          response: {
            my_uid: session.uuid,
            matches: parsedDataArr,
            chats: chatData,
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
