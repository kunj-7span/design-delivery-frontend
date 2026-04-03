import React, { useState, useRef } from "react";
import Button from "../common/button";
import InputField from "../common/input-field";
import { Link } from "react-router-dom";
import { Lock, Camera, Building2, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../schema/auth-schema";
import { useWatch } from "react-hook-form";

const RegisterPageForm = () => {
  // const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      role: "agency_admin",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      contactPersonName: "",
    },
  });

  const role = useWatch({ control, name: "role" });
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const fileInputRef = useRef(null);

  const switchAccountType = (type) => {
    if (type !== role) {
      reset({
        role: type,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        contactPersonName: "",
      });
      setProfilePicPreview(null);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("root", {
          type: "manual",
          message: "Profile picture size cannot exceed 2MB.",
        });
        e.target.value = "";
        return;
      }

      clearErrors("root");
      const url = URL.createObjectURL(file);
      setProfilePicPreview(url);
      setValue("profilePicture", file);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log("Register submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Navigate on success
      // navigate('/dashboard');
    } catch {
      setError("root", {
        type: "server",
        message: "Failed to register. Email might already exist.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
      <div className="flex justify-between mb-4 w-full bg-gray-100 rounded-xl">
        <Button
          type="button"
          onClick={() => switchAccountType("agency_admin")}
          className={`px-4 flex-1 py-2 text-gray-500 text-sm cursor-pointer duration-300 shadow-none transition-colors ${role === "agency_admin" ? "bg-primary text-white" : "hover:bg-gray-200"}`}
        >
          Agency Admin
        </Button>

        <Button
          type="button"
          onClick={() => switchAccountType("client")}
          className={`px-4 flex-1 py-2 text-gray-500 text-sm cursor-pointer duration-300 transition-colors shadow-none ${role === "client" ? "bg-primary text-white" : "hover:bg-gray-200"}`}
        >
          Client
        </Button>
      </div>

      {/* Profile picture */}
      <div className="mb-4 flex flex-col items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <div
          onClick={handleFileClick}
          className="w-18 h-18 rounded-full border-2 border-dashed border-primary flex items-center justify-center overflow-hidden cursor-pointer hover:border-hover-primary hover:bg-purple-100 transition relative group bg-purple-50"
        >
          {profilePicPreview ? (
            <img
              src={profilePicPreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : role === "agency_admin" ? (
            <Building2
              className="text-primary group-hover:opacity-0"
              size={24}
            />
          ) : (
            <User className="text-primary group-hover:opacity-0" size={24} />
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <Camera className="text-white" size={20} />
          </div>
        </div>

        <button
          type="button"
          onClick={handleFileClick}
          className="text-xs text-primary hover:text-hover-primary font-medium"
        >
          Set profile picture
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {errors.root && (
          <div className="p-3 bg-red-100 text-red-600 rounded-xl text-sm text-center">
            {errors.root.message}
          </div>
        )}

        <InputField
          label={role === "agency_admin" ? "Agency Name" : "Client Name"}
          id="name"
          type="text"
          icon={role === "agency_admin" ? Building2 : User}
          placeholder={role === "agency_admin" ? "Agency name" : "Client name"}
          autoComplete="organization"
          error={errors.name}
          {...register("name")}
        />

        <InputField
          label="Email"
          id="email"
          type="email"
          icon={Mail}
          placeholder={
            role === "agency_admin" ? "Agency email" : "Client email"
          }
          autoComplete="email"
          error={errors.email}
          {...register("email")}
        />

        <InputField
          label="Password"
          id="password"
          type="password"
          icon={Lock}
          placeholder="Enter password"
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

        <div className="mt-2">
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="px-4 py-4 bg-primary hover:bg-hover-primary text-white text-sm w-full btn-class"
          >
            {role === "agency_admin"
              ? "Create Agency Account"
              : "Create Client Account"}
          </Button>

          <div className="text-xs mt-5 text-center font-semibold flex items-center justify-center gap-1">
            <span>Already have an account?</span>
            <Link to="/login" className="text-primary hover:text-hover-primary">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RegisterPageForm;
