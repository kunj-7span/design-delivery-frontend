import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  LayoutDashboard,
  Folders,
  IdCard,
  UsersRound,
  Mail,
  Settings,
} from "lucide-react";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: {
        id: null,
        name: null,
        role: null,
        email: null,
      },
      user_avatarURL: null,
      token: null,
      agency_menuItems: [
        {
          name: "Dashboard",
          icon: LayoutDashboard,
          path: "/agency/agency-dashboard",
        },
        { name: "Projects", icon: Folders, path: "/agency/agency-projects" },
        { name: "Client", icon: IdCard, path: "/agency/agency-clients" },
        {
          name: "Employees",
          icon: UsersRound,
          path: "/agency/agency-employees",
        },
      ],
      client_menuItems: [
        { name: "Dashboard", icon: LayoutDashboard, path: "/client/client-dashboard" },
        { name: "Invitations", icon: Mail, path: "/client/invitations" },
        { name: "Projects", icon: Folders, path: "/client/projects" },
        { name: "Calender", icon: IdCard, path: "/client/calender" },
      ],
      employee_menuItems: [
        { name: "Dashboard", icon: LayoutDashboard, path: "/employee/employee-dashboard" },
        { name: "Projects", icon: Folders, path: "/employee/employee-projects" },
      ],
      agency_bottomItems: [{ name: "Settings", icon: Settings, path: "/agency/agency-settings" }],
      client_bottomItems: [{ name: "Settings", icon: Settings, path: "/client/client-settings" }],
      employee_bottomItems: [{ name: "Settings", icon: Settings, path: "/employee/employee-settings" }],

      setAvatar: (avatarURL) => set({ user_avatarURL: avatarURL }),

      setUser: (userData) =>
        set({
          user: {
            id: userData?.id || null,
            name: userData?.name || null,
            email: userData?.email || null,
            role: userData?.role || null,
          },
        }),

      setToken: (token) => set({ token }),

      logout: () =>
        set({
          token: null,
          user: {
            id: null,
            name: null,
            email: null,
            role: null,
          },
          user_avatarURL: null,
        }),
    }),
    {
      name: "auth-storage", // localStorage key name
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        user_avatarURL: state.user_avatarURL,
      }), // Only persist these fields
    },
  ),
);
