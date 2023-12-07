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
import { FaChevronDown, FaChevronUp, FaHome } from 'react-icons/fa';
import { MdSwipeRight, MdGroup } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';

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
            <Link href="/">
              <Button leftIcon={<Icon as={FaHome} />} w="100%" bg="blue.100">
                Home
              </Button>
            </Link>
            {status === 'loading' && (
              <Button border="1px" colorScheme="blue" isLoading>
                Loading..
              </Button>
            )}
            {!session ? (
              <Button
                border="1px"
                color="brand.100"
                onClick={() => signIn('google', { callbackUrl: '/new-user' })}
              >
                Login
              </Button>
            ) : (
              <>
                <Link href="/swipes">
                  <Button
                    leftIcon={<Icon as={MdSwipeRight} />}
                    w="100%"
                    bg="pink.100"
                  >
                    Find Love
                  </Button>
                </Link>
                <Link href="/matches">
                  <Button
                    leftIcon={<Icon as={MdGroup} />}
                    w="100%"
                    bg="green.100"
                  >
                    Matches
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    leftIcon={<Icon as={CgProfile} />}
                    w="100%"
                    bg="brand.200"
                  >
                    Profile
                  </Button>
                </Link>
                <Button bg="brand.800" onClick={handleToggle}>
                  Login Info&nbsp;{show ? <FaChevronUp /> : <FaChevronDown />}
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
  const buttonStyle = {
    size: { base: 'md', xl: 'lg' },
    bg: 'transparent',
    color: 'white',
    position: 'relative' as const, // Needed for positioning the pseudo-element
    _hover: {
      _after: {
        content: `""`,
        position: 'absolute',
        bottom: '0', // Adjust as needed for correct positioning
        left: '50%',
        transform: 'translateX(-50%)',
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'block',
      },
    },
    _after: {
      content: `""`,
      display: 'none',
    },
  };
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
            size={{ base: 'xl', xl: '2xl' }}
            letterSpacing="-.1rem"
          >
            <Link href="/">AniMatcher</Link>
            <Icon ml={2} as={BsArrowThroughHeartFill} />
          </Heading>
        </Flex>
        <HStack
          display={{ base: 'none', lg: 'flex' }}
          width={{ base: 'full', lg: 'auto' }}
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
                <Button {...buttonStyle}>Find Love</Button>
              </Link>
              <Link href="/matches">
                <Button {...buttonStyle}>Matches</Button>
              </Link>
              <Link href="/profile">
                <Button {...buttonStyle}>Profile</Button>
              </Link>
              <Button {...buttonStyle} onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              bg="brand.800"
              // bg = "transparent"
              // color = "white"
              // _hover={{ bg: "transparent", color: "white" }}
              // position="relative" // Needed to position the ::after pseudo-element
              // _hover={{
              //   _after: {
              //     content: `""`, // The content of the ::after pseudo-element; empty string is necessary
              //     position: "absolute",
              //     bottom: "-0.5px", // Position the dot below the button text
              //     left: "50%", // Center the dot horizontally
              //     transform: "translateX(-50%)", // Ensure the center of the dot aligns with the center of the text
              //     width: "5px", // The width of the dot
              //     height: "5px", // The height of the dot
              //     borderRadius: "50%", // Make the dot circular
              //     backgroundColor: "white", // The color of the dot
              //     display: "block", // Change the display from none to block on hover
              //   },
              // }}
              // _after={{
              //   content: `""`,
              //   display: "none", // Hide the dot by default
              // }}
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
            lg: 'none',
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
