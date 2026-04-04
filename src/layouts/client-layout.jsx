import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ClientNavbar from "../components/client/client-navbar";
import ClientSidebar from "../components/client/client-sidebar";

const ClientLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // desktop
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile

  return (
    <div className="container mx-auto flex h-screen relative">
      {/* OVERLAY (only mobile) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <ClientSidebar
        isMobileOpen={isMobileOpen}
        isSidebarOpen={isSidebarOpen}
        closeMobile={() => setIsMobileOpen(false)}
      />

      <div className="flex flex-col flex-1">
        <ClientNavbar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          toggleMobile={() => setIsMobileOpen(true)}
        />

        <main className="overflow-auto scrollbar-hide bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
