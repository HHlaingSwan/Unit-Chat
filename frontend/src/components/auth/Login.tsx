import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../../store/useAuthStore";
import AuthLayout from "./AuthLayout";
import { motion } from "framer-motion";
import loginImage from "../../assets/login.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, authUser } = useAuthStore();
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await login({ email, password });
  };

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  return (
    <AuthLayout imageUrl={loginImage}>
      <motion.h1
        className="mb-4 text-center text-3xl font-extrabold text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome Back!
      </motion.h1>
      <motion.p
        className="mb-6 text-center text-gray-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Sign in to your account to continue
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
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter you password"
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
          {isLoading ? "Logging In..." : "Login"}
        </motion.button>
      </motion.form>
      <motion.p
        className="mt-6 text-center text-sm text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-indigo-400 hover:text-indigo-300"
        >
          Sign Up
        </Link>
      </motion.p>
    </AuthLayout>
  );
};

export default Login;
