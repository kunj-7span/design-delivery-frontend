import { z } from "zod";

export const inviteClientSchema = z.object({
  name: z.string().min(2, "Client name is required"),
  email: z.string().email("Invalid email address"),
});

export const addEmployeeSchema = z.object({
  name: z.string().min(2, "Employee name is required"),
  email: z.string().email("Invalid email address"),
});
