import React from "react";
import { Mail, Lock } from "lucide-react";
import Button from "../common/button";
import InputField from "../common/input-field";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schema/auth-schema";

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // According to your JSON: res.data.data contains { user, token }
      const { token, user } = res.data.data;

      if (token) {
        localStorage.setItem("token", token);

        localStorage.setItem("user", JSON.stringify(user));

        const userRole = user?.role;
        if (userRole === "agency_admin") {
          navigate("/agency/agency-dashboard");
        } else if (userRole === "client") {
          navigate("/client-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (err) {
      setError("root", {
        type: "server",
        message: err.response?.data?.message || "Login failed",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
      <div className="flex flex-col gap-3">
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

        <InputField
          label="Password"
          id="password"
          type="password"
          icon={Lock}
          placeholder="Enter Password"
          autoComplete="current-password"
          error={errors.password}
          {...register("password")}
        />
      </div>

      <div className="flex justify-end my-2">
        <Link
          to="/forgot-password"
          className="text-xs text-end text-primary hover:cursor-pointer hover:text-hover-primary"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="px-4 py-3 bg-primary hover:bg-hover-primary shadow-md shadow-indigo-200 text-white text-sm w-full btn-class"
      >
        Login
      </Button>

      <div className="text-xs mt-5 text-center font-semibold flex justify-center items-center gap-1">
        <span>Don't have an account?</span>
        <Link to="/register" className="text-primary hover:text-hover-primary">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
