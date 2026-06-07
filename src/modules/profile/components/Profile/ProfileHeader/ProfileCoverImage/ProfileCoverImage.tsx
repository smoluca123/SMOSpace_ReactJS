'use no memo';
import { useProfileContext } from '@/hooks/useProfileContext';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function ProfileCoverImage() {
  const { userData } = useProfileContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset the image to its default position on page load
  useEffect(() => {
    if (imageLoaded) {
      controls.start({ y: 0 });
    }
  }, [imageLoaded, controls]);

  return (
    <ContentWrapper
      ref={containerRef}
      className='!p-0 min-h-44 sm:min-h-52 lg:min-h-60 max-h-96 overflow-hidden'
    >
      <motion.img
        src={userData.coverImage}
        alt={userData.displayName}
        className='block object-contain w-full'
        style={{
          transformOrigin: 'top',
          cursor: 'grab',
        }}
        drag='y'
        dragConstraints={containerRef}
        dragElastic={0.1}
        whileTap={{ cursor: 'grabbing' }}
        animate={controls}
        onLoad={() => setImageLoaded(true)}
      />
    </ContentWrapper>
  );
}
