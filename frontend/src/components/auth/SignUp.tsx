import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../../store/useAuthStore";
import AuthLayout from "./AuthLayout";
import { motion } from "framer-motion";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await signup({ username, email, password });
    if (success) {
      navigate("/login");
    }
  };

  return (
    <AuthLayout imageUrl="/signup.png">
      <motion.h1
        className="mb-4 text-center text-3xl font-extrabold text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Create Your Account
      </motion.h1>
      <motion.p
        className="mb-6 text-center text-gray-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Join us and start your journey
      </motion.p>
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="mt-1 block w-full p-4 rounded-md border-gray-500 bg-gray-700/50 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full p-4 rounded-md border-gray-500 bg-gray-700/50 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Enter your password"
            className="mt-1 block w-full p-4 rounded-md border-gray-500 bg-gray-700/50 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </motion.div>
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full transform rounded-md bg-indigo-600 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </motion.button>
      </motion.form>
      <motion.p
        className="mt-6 text-center text-sm text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-indigo-400 hover:text-indigo-300"
        >
          Login
        </Link>
      </motion.p>
    </AuthLayout>
  );
};

export default SignUp;
