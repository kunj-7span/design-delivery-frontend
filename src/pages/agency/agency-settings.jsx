import { useState, useEffect } from "react";
import InputField from "../../components/common/input-field";
import TextareaField from "../../components/common/textarea-field";
import SelectField from "../../components/common/select-field";
import Button from "../../components/common/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  agencySettingsSchema,
  changePasswordSchema,
} from "../../schema/agency-schema";
import {
  getUserProfile,
  updateAgencySettings,
  resetAgencyPassword,
} from "../../services/agency-services";
import { authServices } from "../../services/auth-services";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/auth-store";

export default function AgencySettings() {
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser, setAvatar } = useAuthStore();

  const {
    register: registerSettings,
    handleSubmit: handleSettingsSubmit,
    formState: { errors: settingsErrors, isSubmitting: isSettingsSubmitting },
    setValue: setSettingsValue,
  } = useForm({
    resolver: zodResolver(agencySettingsSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      website: "",
      primary_industry: "",
      mobile_no: "",
      address: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      current_password: "",
      password: "",
      confirm_password: "",
    },
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const profile = await getUserProfile();

        // Set form values with fetched data
        setSettingsValue("name", profile.name);
        setSettingsValue("email", profile.email);
        setSettingsValue("website", profile.website);
        setSettingsValue("primary_industry", profile.primary_industry);
        setSettingsValue("mobile_no", profile.mobile_no);
        setSettingsValue("address", profile.address);

        // Set logo preview if avatar exists
        if (profile.avatar) {
          setLogoPreview(profile.avatar);
          setLogoUrl(profile.avatar);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [setSettingsValue]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set local preview immediately
      const localPreviewUrl = URL.createObjectURL(file);
      setLogoPreview(localPreviewUrl);
      setLogoFile(file);

      try {
        // Generate upload URL
        const response = await authServices.generateUploadUrl(
          file.name,
          file.type,
          "users/avatars",
        );
        
        const { uploadUrl, fileUrl } = response?.data || {};

        if (!uploadUrl || !fileUrl) {
          throw new Error("Invalid upload URL response");
        }

        // Upload file to S3
        await authServices.uploadFileToS3(uploadUrl, file, file.type);

        // Set state for the final S3 URL
        setLogoUrl(fileUrl);
        // Also update preview to the final URL
        setLogoPreview(fileUrl);
      } catch (error) {
        console.error("Failed to upload logo:", error);
        toast.error("Failed to upload logo. Please try again.");
        // Revert the preview if upload failed
        setLogoPreview(logoUrl);
        setLogoFile(null);
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    setLogoUrl(null);
  };

  const onSaveSettings = async (data) => {
    try {
      const payload = {};
      if (data.name) payload.name = data.name;
      if (data.website) payload.website = data.website;
      if (data.primary_industry) payload.primary_industry = data.primary_industry;
      if (data.mobile_no) payload.mobile_no = data.mobile_no;
      if (data.address) payload.address = data.address;
      if (logoUrl) payload.avatar = logoUrl;

      await updateAgencySettings(payload);
      
      // Update store
      if (payload.name) {
        setUser({ ...user, name: payload.name });
      }
      if (payload.avatar) {
        setAvatar(payload.avatar);
      }

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Settings save error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save settings. Please try again.",
      );
    }
  };

  const onChangePassword = async (data) => {
    try {
      await resetAgencyPassword({
        current_password: data.current_password,
        password: data.password,
        confirm_password: data.confirm_password,
      });

      toast.success(
        "Password updated successfully!",
      );

      // Reset form
      resetPasswordForm();
    } catch (error) {
      console.error("Password change error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to change password. Please try again.",
      );
    }
  };

  const industryOptions = [
    { value: "uiux", label: "UI/UX Design Agency" },
    { value: "design", label: "Design & Creative" },
    { value: "tech", label: "Technology" },
    { value: "marketing", label: "Marketing & Advertising" },
    { value: "consulting", label: "Consulting" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen max-w-6xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-gray-500">Loading your settings...</div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Agency Identity Section */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-heading font-semibold text-gray-800">
                  Agency Identity
                </h2>
                <p className="text-xs md:text-sm text-gray-400">
                  Manage your agency&#39;s brand and contact information.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSettingsSubmit(onSaveSettings)}
              className="space-y-4"
              noValidate
            >
              {/* Logo Upload */}
              <div className="flex flex-row items-start gap-6 p-4 md:p-6 bg-gray-50 border border-gray-100 rounded-xl max-md:flex-col max-md:items-center max-md:gap-4">
                <div className="flex justify-center items-center w-20 h-20 border border-gray-200 bg-white rounded-lg shrink-0 overflow-hidden">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Company Logo"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex justify-center items-center py-2 px-1 text-xs text-center text-gray-400 w-full h-full">
                      No Logo
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-1 max-md:text-center">
                  <h3 className="font-semibold text-sm text-gray-800 m-0">
                    Company Logo
                  </h3>
                  <p className="font-normal text-xs md:text-sm text-gray-500 m-0">
                    PNG, SVG or JPG. Recommended size 2MB.
                  </p>
                  <div className="flex flex-row gap-3 mt-2 max-md:justify-center">
                    <label
                      htmlFor="logo-upload"
                      className="font-semibold text-sm py-2 px-4 rounded-lg cursor-pointer text-center transition-all duration-300 bg-primary text-white hover:bg-hover-primary"
                    >
                      Replace Logo
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      className="font-semibold text-sm py-2 px-4 rounded-lg cursor-pointer text-center transition-all bg-transparent text-red-500 hover:bg-red-50"
                      onClick={handleRemoveLogo}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Company Name */}
              <div className="w-full mt-2">
                <InputField
                  label="Agency Name"
                  id="name"
                  placeholder="Enter company name"
                  error={settingsErrors.name}
                  {...registerSettings("name")}
                />
              </div>

              {/* Contact Email & Website */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 w-full">
                <InputField
                  label="Contact Email"
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  error={settingsErrors.email}
                  {...registerSettings("email")}
                  disabled
                  className="cursor-not-allowed"
                />
                <InputField
                  label="Website URL"
                  id="website"
                  placeholder="https://"
                  error={settingsErrors.website}
                  {...registerSettings("website")}
                />
              </div>

              {/* Industry & Phone */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 w-full mt-2">
                <SelectField
                  label="Primary Industry"
                  id="primary_industry"
                  options={industryOptions}
                  error={settingsErrors.primary_industry}
                  {...registerSettings("primary_industry")}
                />
                <InputField
                  label="Business Phone"
                  id="mobile_no"
                  type="tel"
                  placeholder="+91 1234567890"
                  error={settingsErrors.mobile_no}
                  {...registerSettings("mobile_no", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(
                        /[^0-9+\-() ]/g,
                        "",
                      );
                    },
                  })}
                />
              </div>

              {/* Address */}
              <div className="w-full mt-2">
                <TextareaField
                  label="Office Address"
                  id="address"
                  placeholder="Enter office address"
                  rows="4"
                  error={settingsErrors.address}
                  {...registerSettings("address")}
                />
              </div>

              {/* Save Button */}
              <div className="flex flex-row gap-3 pt-2">
                <Button
                  type="submit"
                  isLoading={isSettingsSubmitting}
                  className="px-6 py-2.5 bg-primary text-white hover:bg-hover-primary text-sm"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-subheading font-semibold text-gray-800">
                  Security & Privacy
                </h2>
                <p className="text-xs md:text-sm text-gray-400">
                  Protect your workspace with modern security protocols.
                </p>
              </div>
            </div>

            <form
              onSubmit={handlePasswordSubmit(onChangePassword)}
              className="space-y-4"
              noValidate
            >
              {/* Current Password */}
              <div className="w-full mt-2">
                <InputField
                  label="Current Password"
                  id="current_password"
                  type="password"
                  placeholder="Enter current password"
                  error={passwordErrors.current_password}
                  {...registerPassword("current_password")}
                />
              </div>

              {/* New Password & Confirm Password */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 w-full mt-2">
                <InputField
                  label="New Password"
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  error={passwordErrors.password}
                  {...registerPassword("password")}
                />
                <InputField
                  label="Confirm New Password"
                  id="confirm_password"
                  type="password"
                  placeholder="Confirm new password"
                  error={passwordErrors.confirm_password}
                  {...registerPassword("confirm_password")}
                />
              </div>

              {/* Update Button */}
              <div className="flex flex-row gap-3 pt-2">
                <Button
                  type="submit"
                  isLoading={isPasswordSubmitting}
                  className="px-6 py-2.5 bg-primary text-white hover:bg-hover-primary text-sm"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
