import {
  Heading,
  Box,
  Text,
  Flex,
  Icon,
  Grid,
  GridItem,
  chakra,
  Image,
  shouldForwardProp,
} from '@chakra-ui/react';
import type { Variants } from 'framer-motion';
import { motion, isValidMotionProp } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BsArrowThroughHeartFill, BsArrowDownShort } from 'react-icons/bs';
import { GiOppositeHearts } from 'react-icons/gi';

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

  const [timer, setTimer] = useState(0);

  if (status === 'loading') {
    <Flex
      position="fixed"
      width="full"
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
                Go on your last and first date.
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
            // templateRows="repeat(3, auto)"
            gap={6}
            justifyContent="center"
            templateColumns={{
              base: 'repeat(5, 1fr)',
              sm: 'repeat(12, 1fr)',
            }}
            mx="32px"
            py="20"
          >
            <GridItem
              colSpan={{ base: 5, sm: 8, lg: 6, xl: 5 }}
              colStart={{ base: 0, xl: 2 }}
              rowSpan={{ base: 1 }}
            >
              <ChakraBox
                p={4}
                borderRadius="md"
                height="200px" // Adjust the height as needed
                variants={cardVariants}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.8 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Text
                  fontSize="72"
                  maxWidth="3xl"
                  textAlign="center"
                  fontWeight="medium"
                  color="#E886A4"
                >
                  Revolutionize
                </Text>
                <Text fontSize="28" mb={6} maxWidth="3xl" textAlign="center">
                  the anime dating scene.
                </Text>
              </ChakraBox>
            </GridItem>

            <GridItem
              colSpan={{ base: 1 }}
              colStart={{ base: 3, sm: 6, md: 7, lg: 6 }}
              rowStart={2}
            >
              <ChakraBox
                p={2}
                borderRadius="md"
                height="100px" // Adjust the height as needed
                variants={cardVariants}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.8 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Flex justifyContent="center" alignItems="center" height="50px">
                  {' '}
                  {/* Adjust height as needed */}
                  <GiOppositeHearts color="#E886A4" size="2em" />
                </Flex>
              </ChakraBox>
            </GridItem>
            {/* </ChakraBox> */}

            {/* Goal 2 */}
            <GridItem
              colSpan={{ base: 4, sm: 8, lg: 6, xl: 5 }}
              colStart={{ base: 2, sm: 5, md: 6, lg: 7, xl: 7 }}
              rowSpan={{ base: 1 }}
              rowStart={{ base: 3 }}
            >
              <ChakraBox
                p={4}
                borderRadius="md"
                // height="200px" // Adjust the height as needed
                variants={cardVariants}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.8 }}
                display="box"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Box borderRadius="md" height="400px">
                  <Image
                    rounded="3xl"
                    objectFit="cover"
                    src="/animecouple2.jpeg"
                  />
                </Box>
              </ChakraBox>
            </GridItem>

            {/* Goal 3 */}
            <GridItem
              colSpan={{ base: 5, sm: 8, lg: 6, xl: 5 }}
              colStart={{ base: 0, xl: 2 }}
              rowStart={4}
            >
              <ChakraBox
                p={4}
                borderRadius="md"
                // height="200px" // Adjust the height as needed
                variants={cardVariants}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.8 }}
                display="box"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Box
                  p={4}
                  // bg="gray.200"
                  borderRadius="md"
                  textAlign="center"
                  height="200px"
                >
                  <Text fontSize="24" mb={6} maxWidth="3xl" textAlign="center">
                    Blending cutting-edge technology with a deep for Japanese{' '}
                    <Text
                      as="span"
                      color="#E886A4"
                      fontWeight="semibold"
                      decoration="underline"
                    >
                      love
                    </Text>{' '}
                    animation to spark meaningful connections that resonate on a
                    personal level
                  </Text>
                </Box>
              </ChakraBox>
            </GridItem>
          </Grid>
        </>
      )}
    </>
  );
}
