import { useState } from "react";
import InputField from "../../components/common/input-field";
import TextareaField from "../../components/common/textarea-field";
import SelectField from "../../components/common/select-field";
import Button from "../../components/common/button";
import { authServices } from "../../services/auth-services";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agencySettingsSchema, changePasswordSchema } from "../../schema/agency-schema";

export default function AgencySettings() {
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const {
    register: registerSettings,
    handleSubmit: handleSettingsSubmit,
    formState: { errors: settingsErrors, isSubmitting: isSettingsSubmitting },
  } = useForm({
    resolver: zodResolver(agencySettingsSchema),
    mode: "onChange",
    defaultValues: {
      companyName: "Lumina Design Studio",
      contactEmail: "hello@luminadesign.com",
      website: "https://luminadesign.com",
      industry: "uiux",
      phone: "+1 (555) 000-1234",
      address: "123 Design District, Creative Suite 404, San Francisco, CA 94103",
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
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setLogoFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
  };

  const onSaveSettings = async (data) => {
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("companyName", data.companyName);
      formData.append("contactEmail", data.contactEmail);
      formData.append("website", data.website || "");
      formData.append("industry", data.industry);
      formData.append("phone", data.phone || "");
      formData.append("address", data.address || "");

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      // Simulating API call
      console.log("Saving settings to server...", Object.fromEntries(formData.entries()));
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Settings save error:", error);
      alert(error?.message || "Failed to save settings. Please try again.");
    }
  };

  const onChangePassword = async (data) => {
    try {
      // Call API to change password
      await authServices.changePassword(
        data.currentPassword,
        data.newPassword,
      );

      alert(
        "Password updated successfully! Please login with your new password.",
      );

      // Reset form
      resetPasswordForm();
    } catch (error) {
      console.error("Password change error:", error);
      alert(error?.message || "Failed to change password. Please try again.");
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
      <div className="flex flex-col gap-6">
        {/* Agency Identity Section */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-subheading font-semibold text-gray-800">
                Agency Identity
              </h2>
              <p className="text-xs md:text-sm text-gray-400">
                Manage your agency&#39;s brand and contact information.
              </p>
            </div>
          </div>

          <form onSubmit={handleSettingsSubmit(onSaveSettings)} className="space-y-4" noValidate>
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
                id="companyName"
                placeholder="Enter company name"
                error={settingsErrors.companyName}
                {...registerSettings("companyName")}
              />
            </div>

            {/* Contact Email & Website */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 w-full">
              <InputField
                label="Contact Email"
                id="contactEmail"
                type="email"
                placeholder="Enter email"
                error={settingsErrors.contactEmail}
                {...registerSettings("contactEmail")}
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
                id="industry"
                options={industryOptions}
                error={settingsErrors.industry}
                {...registerSettings("industry")}
              />
              <InputField
                label="Business Phone"
                id="phone"
                type="tel"
                placeholder="+91 1234567890"
                error={settingsErrors.phone}
                {...registerSettings("phone", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9+\-() ]/g, "");
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
              <Button type="submit" isLoading={isSettingsSubmitting} className="px-6 py-2.5 bg-primary text-white hover:bg-hover-primary text-sm">
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

          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4" noValidate>
            {/* Current Password */}
            <div className="w-full mt-2">
              <InputField
                label="Current Password"
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                error={passwordErrors.currentPassword}
                {...registerPassword("currentPassword")}
              />
            </div>

            {/* New Password & Confirm Password */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 w-full mt-2">
              <InputField
                label="New Password"
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                error={passwordErrors.newPassword}
                {...registerPassword("newPassword")}
              />
              <InputField
                label="Confirm New Password"
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                error={passwordErrors.confirmPassword}
                {...registerPassword("confirmPassword")}
              />
            </div>

            {/* Update Button */}
            <div className="flex flex-row gap-3 pt-2">
              <Button type="submit" isLoading={isPasswordSubmitting} className="px-6 py-2.5 bg-primary text-white hover:bg-hover-primary text-sm">
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}