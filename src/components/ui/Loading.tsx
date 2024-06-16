const Loading = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex gap-4 bg-white py-5 px-8 rounded-lg shadow-lg">
        <div className="rounded-full border-[4px] border-t-gray-500 animate-spin w-8 h-8"></div>
        <span className="font-medium text-[18px]">Đang tải</span>
      </div>
    </div>
  );
};

export default Loading;
