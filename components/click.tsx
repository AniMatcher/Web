import type { AnimationControls } from 'framer-motion';
import { motion, useSpring } from 'framer-motion';
import { useState, useRef } from 'react';

import Card from './card';

const spring = {
  type: 'spring',
  stiffness: 300,
  damping: 40,
};

interface CardProps {
  image: string;
  username: string;
  bio: string;
  gender: string;
  animation: AnimationControls;
}

export default function Click({
  image,
  username,
  bio,
  gender,
  animation,
}: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped((prevState) => !prevState);
  };

  const ref = useRef(null);

  const dx = useSpring(0, spring);
  const dy = useSpring(0, spring);

  return (
    <motion.div
      onClick={handleClick}
      transition={spring}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        width: '360px',
        height: '550px',
      }}
    >
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.05 }}
        transition={spring}
        style={{
          width: '100%',
          height: '100%',
          rotateX: dx,
          rotateY: dy,
        }}
      >
        <div
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d',
            width: '100%',
            height: '100%',
          }}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? -180 : 0 }}
            transition={spring}
            style={{
              width: '100%',
              height: '100%',
              zIndex: isFlipped ? 0 : 1,
              backfaceVisibility: 'hidden',
              position: 'absolute',
            }}
          >
            <Card
              image={image}
              username={username}
              bio={bio}
              gender={gender}
              animation={animation}
              variant="front"
            />
          </motion.div>
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: isFlipped ? 0 : 180 }}
            transition={spring}
            style={{
              width: '100%',
              height: '100%',
              zIndex: isFlipped ? 1 : 0,
              backfaceVisibility: 'hidden',
              position: 'absolute',
            }}
          >
            <Card
              image={image}
              username={username}
              bio={bio}
              gender={gender}
              animation={animation}
              variant="back"
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
