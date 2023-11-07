/* eslint-disable no-nested-ternary */

'use client';

import {
  Heading,
  Box,
  Button,
  Spinner,
  Flex,
  VStack,
  IconButton,
  Collapse,
  DrawerFooter,
  HStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Icon,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsArrowThroughHeartFill } from 'react-icons/bs';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

type MyDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

function MyDrawer({ isOpen, onClose }: MyDrawerProps) {
  const { data: session, status } = useSession();
  const [show, setShow] = React.useState(false);

  const handleToggle = () => {
    setShow(!show);
  };
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Menu</DrawerHeader>

        <DrawerBody mr="30px">
          <VStack spacing={5} align="stretch" textAlign="center">
            <Link href="/">Home</Link>
            {status === 'loading' && (
              <Button border="1px" colorScheme="blue" isLoading>
                Loading..
              </Button>
            )}
            {!session ? (
              <Button
                border="1px"
                color="brand.100"
                onClick={(e) => {
                  e.preventDefault();
                  signIn('google');
                }}
              >
                Login
              </Button>
            ) : (
              <>
                <Button bg="brand.800" onClick={handleToggle}>
                  Profile&nbsp;{show ? <FaChevronUp /> : <FaChevronDown />}
                </Button>
                <Collapse in={show} animateOpacity>
                  <VStack spacing="30px">
                    <Box>User: {session.user?.name?.toString()}</Box>
                    <Box>Email: {session.user?.email?.toString()}</Box>
                  </VStack>
                  <Button
                    mt="50px"
                    bg="brand.200"
                    variant="solid"
                    onClick={(e) => {
                      e.preventDefault();
                      signOut();
                    }}
                  >
                    Logout
                  </Button>
                </Collapse>
              </>
            )}
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { status } = useSession();
  const path = usePathname();
  const [NavBarScrolled, setNavbar] = useState(false);
  useEffect(() => {
    if (path === '/') {
      window.addEventListener('scroll', () => {
        if (path === '/') {
          if (window.scrollY >= window.innerHeight) {
            setNavbar(true);
          } else {
            setNavbar(false);
          }
        }
      });
    } else {
      setNavbar(true);
    }
  }, [NavBarScrolled, path]);

  return (
    <>
      <Flex
        zIndex={1}
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        alignItems="center"
        bg={NavBarScrolled ? 'brand.100' : 'transparent'}
        top={0}
        position="sticky"
        color="white"
      >
        <Flex align="left" m={5}>
          <Heading
            alignItems="center"
            as="h1"
            size="2xl"
            letterSpacing="-.1rem"
          >
            <Link href="/">AniMatcher</Link>
            <Icon ml={2} as={BsArrowThroughHeartFill} />
          </Heading>
        </Flex>
        <HStack
          display={{ base: 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          m={4}
          spacing={4}
          flexShrink={1}
        >
          {status === 'loading' ? (
            <Spinner />
          ) : status === 'authenticated' ? (
            <>
              <Link href="/swipes">
                <Button size="lg" bg="pink.100">
                  Start Matching
                </Button>
              </Link>
              <Link href="/profile">
                <Button size="lg" bg="brand.200">
                  Profile
                </Button>
              </Link>
              <Button size="lg" onClick={() => signOut()} bg="brand.800">
                Logout
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              bg="brand.800"
              onClick={() => signIn('google', { callbackUrl: '/new-user' })}
            >
              Sign In
            </Button>
          )}
        </HStack>

        <IconButton
          onClick={onOpen}
          display={{
            base: 'flex',
            md: 'none',
          }}
          aria-label="Open menu"
          mx={3}
          fontSize="20px"
          color="white"
          variant="ghost"
          icon={<AiOutlineMenu />}
        />
      </Flex>
      <MyDrawer onClose={onClose} isOpen={isOpen} />
    </>
  );
}
