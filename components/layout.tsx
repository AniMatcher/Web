import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import Header from './header';

interface LayoutProps {
  children?: ReactNode;
  // any props that come into the component
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box>
      <Header />
      <Box margin="0 auto" transition="0.5s ease-out">
        <Box as="main" marginY={22}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
