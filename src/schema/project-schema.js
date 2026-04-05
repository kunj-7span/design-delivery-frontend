import { z } from "zod";

const requirementSchema = z.object({
  title: z.string().min(1, "Requirement title is required"),
  type: z.string().min(1, "Type is required"),
  deadline: z.string().optional(),
  description: z.string().optional(),
});

export const createProjectSchema = z.object({
  projectName: z
    .string()
    .min(1, "Project name is required")
    .min(3, "Project name must be at least 3 characters"),
  clients: z
    .array(z.string())
    .min(1, "At least one client is required"),
  employees: z
    .array(z.string())
    .min(1, "At least one employee is required"),
  requirements: z
    .array(requirementSchema)
    .min(1, "At least one requirement is needed"),
});
