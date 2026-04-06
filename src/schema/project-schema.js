import { z } from "zod";

const requirementSchema = z.object({
  title: z.string().min(1, "Requirement title is required"),
  type: z.string().min(1, "Type is required"),
  deadline: z.string().optional(),
  description: z.string().optional(),
});

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .min(3, "Project name must be at least 3 characters"),
  clientIds: z
    .array(z.string())
    .min(1, "At least one client is required"),
  employeeIds: z
    .array(z.string())
    .optional()
    .default([]),
  requirements: z
    .array(requirementSchema)
    .min(1, "At least one requirement is needed"),
});
