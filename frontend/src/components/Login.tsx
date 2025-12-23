import { Link } from "react-router";
import axios from "axios";

const Login = () => {
  console.log(axios);
  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      <img
        src="/bg.png"
        alt="background"
        className="absolute top-0 left-0 h-full w-full object-cover"
      />
      <div className="relative flex w-full max-w-md flex-col items-center rounded-2xl border border-white/20 bg-black/30 p-8 text-white shadow-2xl backdrop-blur-lg">
        <h1 className="mb-4 text-3xl font-bold">Login</h1>
        <form className="w-full">
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-lg border border-white/30 bg-black/50 p-2.5 text-white focus:border-blue-500 focus:ring-blue-500"
              placeholder="name@company.com"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded-lg border border-white/30 bg-black/50 p-2.5 text-white focus:border-blue-500 focus:ring-blue-500"
              placeholder="•••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
