import { motion } from "framer-motion";

const AuthLayout = ({
  children,
  direction = "row",
  imageUrl,
}: {
  children: React.ReactNode;
  direction?: "row" | "row-reverse";
  imageUrl: string;
}) => {
  return (
    <div
      className={`flex h-screen w-screen overflow-hidden bg-gray-100 ${
        direction === "row-reverse" ? "flex-row-reverse" : ""
      }`}
    >
      <div className="hidden h-full w-1/2 md:flex items-center justify-center">
        <motion.img
          src={imageUrl}
          alt="background"
          className="h-full w-full object-cover"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 p-4 md:w-1/2">
        <motion.div
          className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
