import React from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Button from "../common/button";
import InputField from "../common/input-field";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../schema/auth-schema";
import { authServices } from "../../services/auth-services";

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

<<<<<<< HEAD
  const onSubmit = async (data) => {
    try {
      const res = await authServices.forgotPassword(data.email);

      if (res.success) {
        console.log("Reset link sent successfully:", res.message);
      }
    } catch (err) {
      setError("root", {
        type: "server",
        message: err?.message || "Failed to send reset link.",
      });
=======
    const onSubmit = async (data) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
                {
                    email: data.email,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (err) {
            setError("root", { type: "server", message: err.response?.data?.message || "Failed to send reset link." });
        }
    };

    if (isSubmitSuccessful) {
        return (
            <div className="w-full text-center">
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm mb-5">
                    If an account exists with that email, we have sent a reset link!
                </div>
                <Link to="/login" className='text-primary hover:text-hover-primary inline-flex items-center justify-center text-sm font-semibold'>
                    <ArrowLeft className='w-4 mr-1' />
                    Back to login
                </Link>
            </div>
        );
>>>>>>> main
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="w-full text-center">
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm mb-5">
          If an account exists with that email, we have sent a reset link!
        </div>
        <Link
          to="/login"
          className="text-primary hover:text-hover-primary inline-flex items-center justify-center text-sm font-semibold"
        >
          <ArrowLeft className="w-4 mr-1" />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
      <div className="flex flex-col gap-2">
        {errors.root && (
          <div className="p-3 bg-red-100 text-red-600 rounded-xl text-sm text-center">
            {errors.root.message}
          </div>
        )}

        <InputField
          label="Email"
          id="email"
          type="email"
          icon={Mail}
          placeholder="Enter Email"
          autoComplete="email"
          error={errors.email}
          {...register("email")}
        />
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="px-4 py-3 bg-primary hover:bg-hover-primary shadow-md shadow-indigo-200 text-white text-sm w-full btn-class mt-3"
      >
        Send Reset Link
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

export default ForgotPasswordForm;
