import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../common/button";
import { useAuthStore } from "../../store/auth-store";
import { authServices } from "../../services/auth-services";

const VerifyOtpForm = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registerData, setRegisterData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);
  const { setToken, setUser, setAvatar } = useAuthStore();

  useEffect(() => {
    try {
      const stateRegisterData = location.state?.registerData;
      const pathEmail = new URLSearchParams(window.location.search).get(
        "email",
      );
      const resolvedEmail = stateRegisterData?.email || pathEmail;

      if (!resolvedEmail) {
        navigate("/register");
        return;
      }

      setRegisterData({
        email: resolvedEmail,
        name: stateRegisterData?.name || "",
        role: stateRegisterData?.role || "",
        password: stateRegisterData?.password || "",
        avatar: stateRegisterData?.avatar || "",
      });
    } catch {
      navigate("/register");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    if (val && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length < 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      if (!registerData) {
        setError("Missing registration data. Please register again.");
        return;
      }

      const { avatar, ...otpPayload } = registerData;
      const res = await authServices.verifyOTP({
        ...otpPayload,
        otp: otpValue,
        ...(avatar && { avatar }),
      });
      const { user, token } = res.data;

      // Store in Zustand instead of localStorage
      if (token) {
        setToken(token);
      }

      setUser({
        name: user?.name || registerData.name,
        email: user?.email || registerData.email,
        role: user?.role || registerData.role,
      });

      // Store avatar URL in Zustand for navbar display
      const avatarUrl = user?.avatar || registerData.avatar || "";
      if (avatarUrl) {
        setAvatar(avatarUrl);
      }

      const role = user?.role || registerData.role;
      if (role === "agency_admin") {
        navigate("/agency/agency-dashboard", { replace: true });
      } else {
        navigate("/client/client-dashboard", { replace: true });
      }
    } catch (err) {
      setError(err?.message || "Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      setError("");
      if (!registerData?.email) {
        setError("Missing email. Please register again.");
        return;
      }
      setTimer(45);
      await authServices.resendOTP(registerData.email);
    } catch (err) {
      setError(err?.message || "Could not resend OTP. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-6"
      noValidate
    >
      {error && (
        <div className="p-3 bg-red-100 text-red-600 rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      <div className="flex gap-2 justify-between">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            value={data}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        ))}
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full py-4 bg-primary hover:bg-hover-primary shadow-md shadow-indigo-200 text-white text-sm btn-class"
      >
        Verify Account
      </Button>

      <div className="text-center text-sm font-medium">
        <span className="text-gray-500">Didn't receive the code? </span>
        {timer > 0 ? (
          <span className="text-gray-400 cursor-not-allowed">
            Resend in {timer}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-primary hover:text-hover-primary shadow-md shadow-indigo-200 transition-colors cursor-pointer"
          >
            Resend OTP
          </button>
        )}
      </div>
    </form>
  );
};

export default VerifyOtpForm;
