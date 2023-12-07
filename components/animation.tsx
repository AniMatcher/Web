import { keyframes } from '@chakra-ui/react';

const spin = keyframes({
  '0%': { transform: 'translateY(1000px) scale(1.3)', height: 0 },
  '20%': {
    transform: 'translateY(1000px) scale(1.3)',
    height: 0,
  },
  '99%': {
    opacity: 1,
    width: '100vw',
    height: '100vh',
  },
  '100%': {
    opacity: 0,
    transform: 'translateY(0px) scale(1)',
  },
});
const spinAnimation = `${spin} 3s cubic-bezier(.4,.37,0,.99) forwards`;
const hide = keyframes({
  '0%': {
    opacity: '1',
  },
  '20%': {
    opacity: '1',
  },
  '99%': {
    opacity: '1',
    width: '100vw',
    height: '100vh',
    zIndex: '3',
  },
  '100%': {
    opacity: '0',
    zIndex: '-3',
  },
});
const hideAnimation = `${hide} 3s forwards`;

const cover = keyframes({
  '0%': {
    opacity: '0',
    transform: 'translateY(100px)',
  },
  '100%': {
    opacity: '1',
    transform: 'translateY(0px)',
  },
});
const coverAni = `${cover} 1s forwards`;

const text = keyframes({
  '0%': {
    opacity: '0',
    position: 'fixed',
  },
  '75%': {
    opacity: '0',
    position: 'sticky',
  },
  '100%': {
    opacity: '1',
    position: 'sticky',
  },
});
const textAnimation = `${text} 4s ease`;

export { spinAnimation, hideAnimation, coverAni, textAnimation };
