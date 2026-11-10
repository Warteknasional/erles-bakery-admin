import React from 'react';
import { motion } from 'framer-motion';

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideUp = ({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 24 }}
    transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.4,
  className = '',
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const StaggerContainer = ({
  children,
  className = '',
  ...props
}) => (
  <motion.div
    variants={staggerVariants}
    initial="hidden"
    animate="visible"
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

const MotionWrapper = {
  FadeIn,
  SlideUp,
  ScaleIn,
  StaggerContainer,
};

export default MotionWrapper;
