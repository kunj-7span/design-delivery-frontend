import React from "react";
import AuthLayout from "../../layouts/auth-layout";
import VerifyOtpForm from "../../components/auth/verify-otp-form";

const VerifyOtpPage = () => {
  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the 6-digit code sent to your email"
    >
      <VerifyOtpForm />
    </AuthLayout>
  );
};

export default VerifyOtpPage;
