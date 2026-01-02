const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <img
        src="/Empty.png"
        alt="Empty State"
        className="w-1/2 h-1/2 object-contain"
      />
      <h2 className="text-2xl font-bold mt-4">Select a chat</h2>
      <p className="text-gray-400">or start a new conversation</p>
    </div>
  );
};

export default EmptyState;
