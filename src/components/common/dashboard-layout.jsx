import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./dashboard-sidebar";
import DashboardNavbar from "./dashboard-navbar";
import LogoutDialog from "./logout-dialog";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // desktop
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile
  const [isLogoutOpen, setIsLogoutOpen] = useState(false); // logout dialog

  return (
    <div className="container mx-auto flex h-screen relative">
      {/* OVERLAY (only mobile) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <DashboardSidebar
        isMobileOpen={isMobileOpen}
        isSidebarOpen={isSidebarOpen}
        closeMobile={() => setIsMobileOpen(false)}
        onLogoutClick={() => setIsLogoutOpen(true)}
      />

      <div className="flex flex-col flex-1">
        <DashboardNavbar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          toggleMobile={() => setIsMobileOpen(true)}
        />

        <main className="overflow-auto scrollbar-hide bg-gray-100">
          <Outlet />
        </main>
      </div>

      {/* Logout Dialog */}
      <LogoutDialog
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
