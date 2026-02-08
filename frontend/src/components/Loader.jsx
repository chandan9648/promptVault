const Loader = () => {
    return (
    <div className="flex justify-center items-center h-64">
      <div className="flex space-x-2">
        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}

export default Loader;