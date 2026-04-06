import React, { useState, useRef, useEffect } from "react";
import Button from "../common/button";
import InputField from "../common/input-field";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Lock, Camera, Building2, Mail, User, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../schema/auth-schema";
import { useWatch } from "react-hook-form";

const RegisterPageForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [invitationData, setInvitationData] = useState(null);
  const invitationToken = searchParams.get("token");
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      role: "client",
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

  // Check for token and validate on component mount
  useEffect(() => {
    const initializeForm = async () => {
      try {
        console.log("first")
        if (invitationToken) {
          // Verify the invitation token
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/agency/client-invitations/verify?token=${invitationToken}`
          );
          console.log(response)
          if (response.data.success) {
            console.log(response)
            const { user_exists, client_name, email } = response.data.data;
            setInvitationData(response.data.data);
            if (user_exists) {
              // User exists, redirect to login with email pre-filled
              navigate(`/login?email=${encodeURIComponent(email)}&token=${invitationToken}`);
            } else {
              // User doesn't exist, pre-fill the form
              reset({
                role: "client",
                name: client_name,
                email: email,
                password: "",
                confirmPassword: "",
                contactPersonName: "",
              });
            }
          }else{
            console.log(response)
          }
        }
      } catch (err) {
        console.error("Error validating invitation token:", err);
        setError("root", {
          type: "manual",
          message: "Invalid or expired invitation link. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeForm();
  }, [invitationToken, reset, setError, navigate]);

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
      localStorage.removeItem("avatarUploadUrl");
      localStorage.removeItem("avatarFileUrl");
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveProfilePic = (e) => {
    e.stopPropagation();
    setProfilePicPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    localStorage.removeItem("avatarUploadUrl");
    localStorage.removeItem("avatarFileUrl");
    clearErrors("root");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setError("root", {
          type: "manual",
          message: "Only JPG, JPEG, and PNG images are allowed.",
        });
        e.target.value = "";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError("root", {
          type: "manual",
          message: "Profile picture size cannot exceed 2MB.",
        });
        e.target.value = "";
        return;
      }

      clearErrors("root");
      const previewUrl = URL.createObjectURL(file);
      setProfilePicPreview(previewUrl);

      try {
        // Step 1: Get pre-signed upload URL
        const generateRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/upload/generate-url`,
          {
            fileName: file.name,
            contentType: file.type,
            folder: "users/avatars",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const { uploadUrl, fileUrl } = generateRes.data.data;

        // Step 2: Upload file directly to S3
        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        // Step 3: Store URLs in localStorage
        localStorage.setItem("avatarUploadUrl", uploadUrl);
        localStorage.setItem("avatarFileUrl", fileUrl);
      } catch (err) {
        setError("root", {
          type: "manual",
          message:
            err.response?.data?.message ||
            "Failed to upload profile picture. Please try again.",
        });
        setProfilePicPreview(null);
        e.target.value = "";
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      // Read avatar fileUrl from localStorage
      const avatarUrl = localStorage.getItem("avatarFileUrl") || "";

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        ...(avatarUrl && { avatar: avatarUrl }),
      };
      console.log("123456",payload)

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Store registration data in localStorage
      try {
        localStorage.setItem(
          "registerData",
          JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            ...(avatarUrl && { avatar: avatarUrl }),
          }),
        );
      } catch (e) {
        console.error("Failed to save to localStorage", e);
      }

      // Navigate to client dashboard if registered via invitation
      
        navigate("/verify-otp");
      
    } catch (err) {
      setError("root", {
        type: "server",
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to register. Please try again.",
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-gray-600 text-sm">Loading registration form...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
          <div className="flex justify-between mb-4 w-full bg-gray-100 rounded-xl">
            <Button
              type="button"
              onClick={() => switchAccountType("agency_admin")}
              disabled={!!invitationToken}
              className={`px-4 flex-1 py-2 text-gray-500 text-sm cursor-pointer duration-300 shadow-none transition-colors ${role === "agency_admin" ? "bg-primary text-white" : "hover:bg-gray-200"} ${invitationToken ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Agency Admin
            </Button>

            <Button
              type="button"
              onClick={() => switchAccountType("client")}
              disabled={!!invitationToken}
              className={`px-4 flex-1 py-2 text-gray-500 text-sm cursor-pointer duration-300 transition-colors shadow-none ${role === "client" ? "bg-primary text-white" : "hover:bg-gray-200"} ${invitationToken ? "opacity-50 cursor-not-allowed" : ""}`}
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
          accept=".png, .jpg, .jpeg, image/png, image/jpeg"
          onChange={handleFileChange}
        />
        <div className="relative inline-block">
          <div
            onClick={!profilePicPreview ? handleFileClick : undefined}
            className={`w-18 h-18 rounded-full border-2 flex items-center justify-center overflow-hidden ${
              profilePicPreview
                ? "border-0"
                : "border-dashed border-primary hover:border-hover-primary hover:bg-purple-100 cursor-pointer"
            } transition relative group bg-purple-50`}
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

          {profilePicPreview && (
            <button
              type="button"
              onClick={handleRemoveProfilePic}
              className="cursor-pointer absolute -top-2 -right-4 bg-red-500 hover:bg-red-600 rounded-full p-1 text-white transition shadow-lg"
            >
              <X size={16} />
            </button>
          )}
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
            className="px-4 py-4 bg-primary hover:bg-hover-primary shadow-md shadow-indigo-200 text-white text-sm w-full btn-class"
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
      )}
    </>
  );
};

export default RegisterPageForm;
