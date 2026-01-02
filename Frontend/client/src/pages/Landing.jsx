import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Landing({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 4000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="h-screen bg-black flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      <motion.h1
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="text-6xl font-extrabold tracking-widest text-teal-400"
      >
        ATS CHECKER
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-6 text-gray-400 text-sm"
      >
        Optimizing resumes for automated systems
      </motion.p>
    </motion.div>
  );
}
