import {
  Heading,
  Box,
  Text,
  Flex,
  Icon,
  Grid,
  GridItem,
  chakra,
  shouldForwardProp,
} from '@chakra-ui/react';
import type { Variants } from 'framer-motion';
import { motion, isValidMotionProp } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { BsArrowThroughHeartFill } from 'react-icons/bs';

import * as animation from '../components/animation';
import Layout from '../components/layout';
import { useEffect, useState } from 'react';

const cardVariants: Variants = {
  offscreen: {
    opacity: 0,
  },
  onscreen: {
    opacity: 1,
    transition: {
      duration: 1.5,
    },
  },
};

const ChakraBox = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default function Home() {
  const { status } = useSession();
  const [timer, setTimer] = useState(0);

  if (status === 'loading') {
    <Flex
      position="fixed"
      width="full"
      height="100vh"
      bgColor="#1a1a1a"
      animation={animation.hideAnimation}
      zIndex="3"
      alignItems="center"
      justifyContent="center"
    />;
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer <= 8) {
        setTimer(timer + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
  return (
    <>
      <Flex
        position="fixed"
        width="full"
        height="100vh"
        bgColor="#1a1a1a"
        animation={animation.hideAnimation}
        zIndex="3"
        alignItems="center"
        justifyContent="center"
      >
        <Heading fontSize="5xl" textColor="white">
          <Flex animation={animation.coverAni}>
            <Text letterSpacing="-.1rem">AniMatcher</Text>
            <Icon as={BsArrowThroughHeartFill} />
          </Flex>
        </Heading>
      </Flex>
      <Box
        position="fixed"
        width="full"
        backgroundImage="/cute-anime-couple.jpg"
        backgroundPosition="center center"
        animation={animation.spinAnimation}
        zIndex="3"
      />
      <Box
        height="100vh"
        backgroundImage="/cute-anime-couple.jpg"
        backgroundPosition="center center"
      >
        <Box animation={animation.textAnimation}>
          <Layout>
            <Box
              className="back"
              position="absolute"
              zIndex="0"
              top="0"
              display="flex"
              alignContent="center"
              w="100%"
              h="100vh"
            >
              <Flex
                bottom={0}
                p={{ base: 0, md: 6, lg: 10 }}
                width={{ base: '100%', md: '50%', lg: '45%', xl: '50%' }}
                left={0}
                justifyContent="center"
                textAlign={{ base: 'left', md: 'left' }}
                flexDir="column"
                alignContent={{ base: 'center', md: 'center' }}
              >
                <Heading ml={4} size={{ base: '2xl', md: '4xl' }} color="white">
                  Find your ハニー{' '}
                </Heading>
                <Text ml={4} mt={3} maxW="80%" fontSize="3xl" color="white">
                  Find love from what you love:
                </Text>
                <Heading ml={4} size={{ base: 'xl', md: '2xl' }} color="pink">
                  Anime!
                </Heading>
              </Flex>
            </Box>
          </Layout>
        </Box>
      </Box>
      {timer > 2 && (
        <>
          <ChakraBox
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
            display="flex"
          >
            <ChakraBox
              display="flex"
              flexDir="column"
              textAlign="center"
              mx="auto"
              // textAlign={{ base: 'left', md: 'left' }}
              variants={cardVariants}
              pt={{ base: '10vh', md: '15vh' }}
            >
              <Text fontSize="lg" mb={2} color="gray.500">
                Our Mission
              </Text>
              <Heading fontSize="5xl" mb={4}>
                Go on your{' '}
                <Text as="span" textDecoration="line-through">
                  last
                </Text>{' '}
                first date.
              </Heading>
              <Text fontSize="lg" mb={6} maxWidth="3xl" textAlign="center">
                AniMatcher is built on the belief that anyone looking for love
                should be able to find it. It&apos;s also built on an acclaimed
                Nobel-Prize-winning algorithm, so we can succeed in getting you
                out on promising dates, not keeping you on the app.
              </Text>
            </ChakraBox>
          </ChakraBox>

          <Grid
            templateColumns={{ base: 'repeat(5, 1fr)', sm: 'repeat(12, 1fr)' }}
            templateRows="repeat(3, 1fr)"
            mx="32px"
            py="20"
          >
            <GridItem
              colSpan={{ base: 5, sm: 8, lg: 6, xl: 5 }}
              bgColor="gray"
              colStart={{ base: 0, xl: 2 }}
            >
              <Text fontSize="3xl">Goal 1</Text>
            </GridItem>
            <GridItem
              colSpan={{ base: 1 }}
              rowStart={2}
              colStart={{ base: 3, sm: 6, md: 7, lg: 6 }}
            >
              arrow
            </GridItem>
            <GridItem
              colSpan={{ base: 4, sm: 8, md: 7, lg: 7, xl: 5 }}
              bgColor="gray"
              colStart={{ base: 2, sm: 5, md: 6, lg: 7, xl: 7 }}
              rowStart={3}
            >
              <Text fontSize="3xl">Goal 2</Text>
            </GridItem>
            <GridItem></GridItem>
          </Grid>
        </>
      )}
    </>
  );
}
