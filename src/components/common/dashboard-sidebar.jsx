import DDLogoFull from "../../assets/DDLogoFull.png";
import DDlogo from "../../assets/DDlogo.svg";
import {
  LayoutDashboard,
  Folders,
  IdCard,
  UsersRound,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";

const DashboardSidebar = ({
  isMobileOpen,
  isSidebarOpen,
  closeMobile,
  onLogoutClick,
}) => {
  const { user, agency_menuItems, client_menuItems, employee_menuItems } =
    useAuthStore();
  const bottomItems = [
    { name: "Settings", icon: Settings, path: "/agency/agency-settings" },
  ];
  let menuItems = [];
  if (user.role === "agency_admin") menuItems = agency_menuItems;
  else if (user.role === "client") menuItems = client_menuItems;
  else menuItems = employee_menuItems;

  return (
    <aside
      className={`
    fixed md:static top-0 left-0 z-50 h-screen bg-white flex flex-col justify-between
    transition-all duration-300 ease-in-out overflow-hidden shadow

    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0

    ${isSidebarOpen ? "w-56" : "w-16"} 
  `}
    >
      {/* TOP SECTION */}
      <div className="px-3 pt-4">
        {/* LOGO */}
        <Link
          to="/agency/agency-dashboard"
          className="mb-6 flex items-center justify-start gap-3 overflow-hidden"
        >
          <img src={DDlogo} alt="logo" className="w-9.5" />
          <span className="text-xl/5 font-semibold text-gray-700">
            design
            <br />
            delivery
          </span>
        </Link>

        {/* MENU ITEMS */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={index}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white font-medium shadow-md shadow-indigo-200"
                      : "hover:bg-gray-200 text-gray-700"
                  }`
                }
              >
                {/* ICON */}
                <div className="flex justify-center items-center">
                  <Icon size={22} />
                </div>

                {/* TEXT */}
                <span
                  className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isSidebarOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 w-0"
                  }`}
                >
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="px-3 pb-4 space-y-2">
        {bottomItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              onClick={closeMobile}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white font-medium"
                    : "hover:bg-gray-200 text-gray-700"
                }`
              }
            >
              <div className="flex justify-center items-center">
                <Icon size={22} />
              </div>

              <span
                className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isSidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 w-0"
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}

        {/* LOGOUT */}
        <button
          onClick={onLogoutClick}
          className="flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-red-50 text-gray-700 hover:text-red-600 w-full"
        >
          <div className="flex justify-center items-center">
            <LogOut size={22} />
          </div>
          <span
            className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isSidebarOpen
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 w-0"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
