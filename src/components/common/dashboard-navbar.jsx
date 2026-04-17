import { PanelRightOpen, PanelRightClose, Bell } from "lucide-react";
import profile from "../../assets/user-icon.png";
import { useAuthStore } from "../../store/auth-store";

const DashboardNavbar = ({ isSidebarOpen, toggleSidebar, toggleMobile }) => {
  // Get user data from Zustand
  const user = useAuthStore((state) => state.user);
  const userAvatarURL = useAuthStore((state) => state.user_avatarURL);

  return (
    <header className="min-h-16 bg-white shadow-md border-b border-gray-200 flex items-center justify-between px-4">
      {/* DESKTOP TOGGLE */}
      <div className="hidden lg:block">
        {isSidebarOpen ? (
          <PanelRightOpen onClick={toggleSidebar} className="cursor-pointer" />
        ) : (
          <PanelRightClose onClick={toggleSidebar} className="cursor-pointer" />
        )}
      </div>

      {/* MOBILE TOGGLE */}
      <div className="lg:hidden">
        <PanelRightOpen onClick={toggleMobile} className="cursor-pointer" />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-7">
        <Bell className="cursor-pointer" />
        <div className="h-7 border border-gray-300"></div>

        <div className="flex items-center gap-3">
          <div className="text-end font-semibold">
            <p className="text-sm">{user.name || "Agency"}</p>
            <p className="text-xs text-gray-500">{user.role === "agency_admin" ? "Admin" : user.role === "client" ? "Client" : "Employee"}</p>
          </div>
          <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-400">
            <img
              src={userAvatarURL || user.avatar || profile}

              alt="profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = profile;
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
