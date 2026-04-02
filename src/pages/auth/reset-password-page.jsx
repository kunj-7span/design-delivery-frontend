import React from "react";
import AuthLayout from "../../layouts/auth-layout";
import ResetPasswordForm from "../../components/auth/reset-password-form";

const ResetPasswordPage = () => {
  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a strong password for your account"
    >
    <ResetPasswordForm/>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
