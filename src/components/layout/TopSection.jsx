//must be used in future
import { Menu } from "lucide-react";

const TopSection = ({ onMenuClick }) => {
  return (
    <div className="bg-white border ">
      {/* ===== MOBILE HEADER ===== */}
      <div className="lg:hidden px-4 py-3 space-y-3  border">
        {/* Row: Hamburger + Search */}
        <div className="flex items-center gap-3">
          {/* Hamburger */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>

          {/* Search 70% width */}
          <div className="flex-1 ">
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-gray-100 rounded-md px-3 py-2 outline-none text-sm"
            />
          </div>
        </div>

        {/* 🔵 Mobile Banner */}
        <div className="bg-primary text-white mt-4 rounded-md py-3 px-3 text-center">
          <p className="text-sm font-medium">
            Welcome Back to Greenfield High School
          </p>
        </div>
      </div>

      {/* ===== DESKTOP HEADER ===== */}
      <div className="hidden lg:block space-y-1 p-1">
        {/* Banner */}
        <div className="bg-primary text-white rounded-xl px-6 py-2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Welcome Back to Greenfield High School
            </h2>
            <p className="text-sm opacity-90">
              Manage students, results, attendance and more efficiently.
            </p>
          </div>

          <div className="w-[110px] h-[110px] rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
            <img
              src="https://img.freepik.com/premium-vector/demo-video-icon-symbol-mark-outline-style_1223784-23663.jpg?semt=ais_user_personalization&w=740&q=80"
              alt="Demo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm px-4 py-3">
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full outline-none border border-gray-300
            rounded-lg
            px-4 py-2.5
            text-sm
            text-gray-700
            placeholder-gray-400
             shadow-sm

            "
          />
        </div>
      </div>
    </div>
  );
};

export default TopSection;
