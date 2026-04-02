import React from "react";
import AuthLayout from "../../layouts/auth-layout";
import LoginForm from "../../components/auth/login-form";

const LoginPage = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in your account Design Delivery account"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
