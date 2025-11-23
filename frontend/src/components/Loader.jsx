
const Loader = () => {
    return (
    <div className="flex justify-center items-center h-64">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}

export default Loader;