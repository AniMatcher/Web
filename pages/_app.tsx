// pages/_app.js

'use client';

import '@fontsource-variable/outfit';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

const theme = extendTheme({
  colors: {
    brand: {
      // 100: '#FF9F1C',
      // 200: '#FFBF69',
      100: '#FF91A4',
      200: '#FF69B4',

      800: '#CBF3F0',
      900: '#2EC4B6',
    },
  },
  fonts: {
    heading: `'Outfit Variable', sans-serif`,
    body: `'Outfit Variable', sans-serif`,
  },
});

function Providers({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}

export default Providers;
