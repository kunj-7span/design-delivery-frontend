import React, { useEffect, useState } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import Button from "../common/button";
import InputField from "../common/input-field";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../schema/auth-schema";
import axios from "axios";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tokenVerified, setTokenVerified] = useState(false);
  const [tokenVerifying, setTokenVerifying] = useState(true);
  const [tokenError, setTokenError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      setTokenVerifying(true);
      setTokenError(null);

      if (!token) {
        setTokenError("No reset token provided. Please check your email link.");
        setTokenVerifying(false);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password-verify-token`,
          {
            params: { token },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.success) {
          setTokenVerified(true);
        }
      } catch (err) {
        setTokenError(
          err.response?.data?.message || "Invalid or expired reset token. Please request a new reset link."
        );
      } finally {
        setTokenVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password-reset`,
        {
          token,
          newPassword: data.password,
          confirmPassword: data.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        console.log("Password reset successfully:", res.data.message);
        setIsSuccess(true);
        // Navigate to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError("root", {
        type: "server",
        message: err.response?.data?.message || "Failed to reset password. Link might be expired.",
      });
    }
  };


  // Show loading state while verifying token
  if (tokenVerifying) {
    return (
      <div className="w-full text-center">
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            Verifying your reset token...
          </div>
        </div>
      </div>
    );
  }

  // Show error state if token verification failed
  if (tokenError) {
    return (
      <div className="w-full text-center">
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm mb-5">
          {tokenError}
        </div>
        <Link
          to="/forgot-password"
          className="text-primary hover:text-hover-primary inline-flex items-center justify-center text-sm font-semibold"
        >
          <ArrowLeft className="w-4 mr-1" />
          Request a new reset link
        </Link>
      </div>
    );
  }

  // Show form if token is verified
  if (!tokenVerified) {
    return null;
  }

  // Show success state
  if (isSuccess) {
    return (
      <div className="w-full text-center">
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm mb-5">
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 text-green-600">
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-semibold">Your password has been reset successfully!</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-3">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
            Redirecting to login...
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
      <div className="flex flex-col gap-2 my-2">
        {errors.root && (
          <div className="p-3 bg-red-100 text-red-600 rounded-xl text-sm text-center">
            {errors.root.message}
          </div>
        )}

        <InputField
          label="New Password"
          id="password"
          type="password"
          icon={Lock}
          placeholder="Enter new password"
          autoComplete="new-password"
          error={errors.password}
          {...register("password")}
        />

        <InputField
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          icon={Lock}
          placeholder="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="px-4 py-3 bg-primary hover:bg-hover-primary shadow-md shadow-indigo-200 text-white text-sm w-full btn-class mt-3"
      >
        Reset Password
      </Button>

      <div className="text-xs mt-5 text-center font-semibold">
        <Link
          to="/login"
          className="text-primary inline-flex items-center justify-center hover:text-hover-primary"
        >
          <ArrowLeft className="w-4 mr-1" />
          Back to login
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordForm;