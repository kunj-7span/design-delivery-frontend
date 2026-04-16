import { z } from "zod";

export const inviteClientSchema = z.object({
  name: z.string().min(2, "Client name is required"),
  email: z.string().email("Invalid email address"),
});

export const addEmployeeSchema = z.object({
  name: z.string().min(2, "Employee name is required"),
  email: z.string().email("Invalid email address"),
});

const passwordStyles = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character",
  );

export const agencySettingsSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactEmail: z.string().min(1, "Contact email is required").email("Invalid email address"),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
  industry: z.string().min(1, "Please select an industry"),
  phone: z.string().min(10, "Phone number is too short").or(z.literal("")).optional(),
  address: z.string().or(z.literal("")).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordStyles,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm password must match the new password",
    path: ["confirmPassword"],
  });
