const TopSection = () => {
  return (
    <div className="space-y-2 p-2">

      {/* Compact Banner */}
      <div className="bg-primary text-white rounded-xl px-6 py-2 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Welcome Back to Greenfield High School
          </h2>
          <p className="text-sm opacity-90">
            Manage students, results, attendance and more efficiently.
          </p>
        </div>

             {/* Proper Full Circular Image */}
        <div className="hidden md:block w-[110px] h-[110px] rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
          <img
            src="https://img.freepik.com/premium-vector/demo-video-icon-symbol-mark-outline-style_1223784-23663.jpg?semt=ais_user_personalization&w=740&q=80"
            alt="Demo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm px-4 py-3 ">
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full outline-none text-gray-700"
        />
      </div>

    </div>
  );
};

export default TopSection;
