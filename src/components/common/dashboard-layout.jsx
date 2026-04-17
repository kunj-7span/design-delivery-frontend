import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./dashboard-sidebar";
import DashboardNavbar from "./dashboard-navbar";
import LogoutDialog from "./logout-dialog";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <div className="container mx-auto relative flex h-screen">
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <DashboardSidebar
        isMobileOpen={isMobileOpen}
        isSidebarOpen={isSidebarOpen}
        closeMobile={() => setIsMobileOpen(false)}
        onLogoutClick={() => setIsLogoutOpen(true)}
      />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          toggleMobile={() => setIsMobileOpen(true)}
        />

        <main className="scrollbar-hide overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>

      <LogoutDialog isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
