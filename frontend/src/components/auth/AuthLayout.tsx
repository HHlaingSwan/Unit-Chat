import { motion } from "framer-motion";

const AuthLayout = ({
  children,
  imageUrl,
}: {
  children: React.ReactNode;
  imageUrl: string;
}) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Image */}
      <motion.img
        src={imageUrl}
        alt="background"
        className="absolute top-0 left-0 h-full w-full object-cover"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
      />
      {/* Overlay and Form Container */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center bg-black/50 p-4">
        <motion.div
          className="w-full max-w-md rounded-2xl border border-white/20 bg-black/30 p-8 text-white shadow-2xl backdrop-blur-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
