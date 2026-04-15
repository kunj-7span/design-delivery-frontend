import React, { useEffect, useState } from "react";
import { Mail, Lock, CloudSnow } from "lucide-react";
import Button from "../common/button";
import InputField from "../common/input-field";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schema/auth-schema";
import { useAuthStore } from "../../store/auth-store";
import { authServices } from "../../services/auth-services";

const LoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isInvitationFlow, setIsInvitationFlow] = useState(false);
  const prefillEmail = searchParams.get("email");
  const invitationToken = searchParams.get("token");
  const { token, user, setToken, setUser, setAvatar } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: prefillEmail || "",
      password: "",
    },
  });

  useEffect(() => {
    if (invitationToken) {
      setIsInvitationFlow(true);
    }
  }, [invitationToken]);

  useEffect(() => {
    if (token) {
      if (user.role === "agency_admin") {
        navigate("/agency/agency-dashboard");
      } else if (user.role === "client") {
        navigate("/client/client-dashboard");
      } else {
        navigate("/employee/employee-dashboard");
      }
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await authServices.loginUser(data.email, data.password);
      const { token, user } = res.data;

      if (token) {
        setToken(token);
        setUser(user);

        if (user?.avatar) {
          setAvatar(user.avatar);
        }

        const userRole = user?.role;
        if (userRole === "agency_admin") {
          navigate("/agency/agency-dashboard", { replace: true });
        } else if (userRole === "client") {
          // If coming from invitation, navigate to client dashboard
          if (isInvitationFlow) {
            navigate("/client/client-dashboard", { replace: true });
          } else {
            navigate("/client/client-dashboard", { replace: true });
          }
        } else {
          navigate("/employee/employee-dashboard", { replace: true });
        }
      }
    } catch (err) {
      setError("root", {
        type: "server",
        message: err?.message || "Login failed",
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
          disabled={!!prefillEmail}
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
