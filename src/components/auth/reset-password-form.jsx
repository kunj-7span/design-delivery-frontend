import React from "react";
import { Lock, ArrowLeft } from "lucide-react";
import Button from "../common/button";
import InputField from "../common/input-field";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../schema/auth-schema";

const ResetPasswordForm = () => {
  // const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      console.log("Reset password submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Navigate on success
      // navigate('/login');
    } catch {
      setError("root", {
        type: "server",
        message: "Failed to reset password. Link might be expired.",
      });
    }
  };

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
        className="px-4 py-3 bg-primary hover:bg-hover-primary text-white text-sm w-full btn-class mt-3"
      >
        Send New Password
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