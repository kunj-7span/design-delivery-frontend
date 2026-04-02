import { z } from 'zod';

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number");

const matchPasswords = (data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords don't match",
            path: ["confirmPassword"]
        });
    }
};

export const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string()
}).superRefine(matchPasswords);

export const registerSchema = z.object({
    accountType: z.enum(["agency", "client"]),
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    contactPersonName: z.string().optional(),
    password: passwordSchema,
    confirmPassword: z.string()
}).superRefine((data, ctx) => {
    if (data.accountType === "client" && (!data.contactPersonName || data.contactPersonName.trim() === "")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Contact Person Name is required",
            path: ["contactPersonName"]
        });
    }
    matchPasswords(data, ctx);
});
