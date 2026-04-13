import publicClient from "../api/public-client";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authServices = {
  // Login user
  async loginUser(email, password) {
    try {
      const res = await publicClient.post("/auth/login", {
        email,
        password,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Register user
  async registerUser(payload) {
    try {
      const res = await publicClient.post("/auth/register", payload);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify invitation token
  async verifyInvitationToken(token) {
    try {
      const res = await publicClient.get(
        `/agency/client-invitations/verify?token=${token}`,
      );
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Forgot password - send reset link
  async forgotPassword(email) {
    try {
      const res = await publicClient.post("/auth/forgot-password", {
        email,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify reset token
  async verifyResetToken(token) {
    try {
      const res = await publicClient.get("/auth/forgot-password-verify-token", {
        params: { token },
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reset password
  async resetPassword(token, newPassword, confirmPassword) {
    try {
      const res = await publicClient.post("/auth/forgot-password-reset", {
        token,
        newPassword,
        confirmPassword,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify OTP
  async verifyOTP(payload) {
    try {
      const res = await publicClient.post("/auth/verify-otp", payload);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Resend OTP
  async resendOTP(email) {
    try {
      const res = await publicClient.post("/auth/resend-otp", {
        email,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate upload URL for S3
  async generateUploadUrl(fileName, contentType, folder) {
    try {
      const res = await publicClient.post("/upload/generate-url", {
        fileName,
        contentType,
        folder,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload file to S3
  async uploadFileToS3(uploadUrl, file, contentType) {
    try {
      const res = await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": contentType,
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  async logOut() {
    try {
      const res = await publicClient.post("/auth/logout");
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
