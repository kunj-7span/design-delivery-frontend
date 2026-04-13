import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./confirm-dialog";
import { authServices } from "../../services/auth-services";
import { useAuthStore } from "../../store/auth-store";

const LogoutDialog = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      // Call logout API if needed
      try {
        await authServices.logOut();
      } catch (apiError) {
        console.warn("Logout API error:", apiError);
        // Continue with local logout even if API call fails
      }

      // Clear auth store
      logout();

      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Log Out"
      message="Are you sure you want to log out? You will need to sign in again to access your designs."
      icon={<LogOut size={28} className="text-red-500" />}
      iconBgColor="bg-pink-100"
      iconColor="text-red-500"
      confirmButtonText={isLoading ? "Logging out..." : "Log out"}
      cancelButtonText="Cancel"
      confirmButtonColor="bg-red-600 hover:bg-red-700"
      onConfirm={handleLogout}
      onCancel={onClose}
    />
  );
};

export default LogoutDialog;
