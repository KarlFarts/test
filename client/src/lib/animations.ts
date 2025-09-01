import { Variants } from "framer-motion";

// Core animation variants for consistent motion design
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

export const slideInFromBottom: Variants = {
  initial: { opacity: 0, y: "100%" },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "100%" }
};

export const slideInFromTop: Variants = {
  initial: { opacity: 0, y: "-100%" },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "-100%" }
};

// Stagger animations for lists
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Modal and overlay animations
export const modalOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

// Card hover animations
export const cardHover: Variants = {
  initial: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  }
};

export const cardPress: Variants = {
  initial: { scale: 1 },
  tap: { scale: 0.98 }
};

// Button animations
export const buttonHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 400
    }
  },
  tap: { scale: 0.95 }
};

// Loading skeleton animation
export const skeletonPulse: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Page transition animations
export const pageTransition: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Sidebar animations
export const sidebarSlide: Variants = {
  closed: { x: "-100%" },
  open: { 
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  }
};

// Command palette animations
export const commandPaletteContainer: Variants = {
  initial: { opacity: 0, scale: 0.95, y: -20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 400
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -20,
    transition: {
      duration: 0.15
    }
  }
};

// Drag and drop animations
export const dragItem: Variants = {
  initial: { scale: 1, rotate: 0 },
  drag: { 
    scale: 1.05, 
    rotate: 5,
    zIndex: 1000,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  }
};

export const dropZone: Variants = {
  initial: { scale: 1, borderColor: "transparent" },
  hover: { 
    scale: 1.02,
    borderColor: "rgb(59, 130, 246)",
    transition: {
      duration: 0.2
    }
  }
};

// Notification animations
export const notificationSlide: Variants = {
  initial: { opacity: 0, x: "100%", scale: 0.95 },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    x: "100%", 
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

// Transition configurations
export const springTransition = {
  type: "spring" as const,
  damping: 25,
  stiffness: 300
};

export const easeTransition = {
  duration: 0.3,
  ease: "easeOut" as const
};

export const quickTransition = {
  duration: 0.15,
  ease: "easeInOut" as const
};
