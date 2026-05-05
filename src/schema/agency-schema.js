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
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .or(z.literal(""))
    .optional(),
  email: z
    .string()
    .email("Invalid email address")
    .or(z.literal(""))
    .optional(),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
  primary_industry: z.string().or(z.literal("")).optional(),
  mobile_no: z
    .string()
    .min(10, "Phone number is too short")
    .or(z.literal(""))
    .optional(),
  address: z.string().or(z.literal("")).optional(),
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    password: passwordStyles,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Confirm password must match the new password",
    path: ["confirm_password"],
  });

export const createRequirementSchema = z.object({
  requirement: z.string().min(2, "Requirement name is required"),
  deadline: z.string().min(1, "Deadline is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(2, "Description is required"),
  referenceFile: z.any().optional(),
});
