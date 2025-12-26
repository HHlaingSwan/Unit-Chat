import useAuthStore from "./store/useAuthStore";

const App = () => {
  const { authUser } = useAuthStore();
  console.log("authUser", authUser);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      <img
        src="/bg.png"
        alt="background"
        className="absolute top-0 left-0 h-full w-full object-cover"
      />
      <div className="relative flex h-[90vh] w-full max-w-6xl rounded-2xl border border-white/20 bg-black/30 text-white shadow-2xl backdrop-blur-lg"></div>
    </div>
  );
};

export default App;
