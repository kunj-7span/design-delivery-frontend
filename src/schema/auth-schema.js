import { z } from "zod";

// Strict email: user@domain.tld or user@domain.co.tld (max 2-part extension)
const strictEmailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character",
  );

const matchPasswords = (data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
  }
};

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address").regex(strictEmailRegex, "Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .regex(strictEmailRegex, "Invalid email format")
    .toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine(matchPasswords);

export const registerSchema = z
  .object({
    role: z.enum(["agency_admin", "client"]),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .regex(strictEmailRegex, "Invalid email format"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine(matchPasswords);
