import { z } from "zod";

const requirementSchema = z.object({
  title: z.string().min(1, "Requirement title is required"),
  type: z.string().min(1, "Requirement type is required"),
  deadline: z.string().optional().nullable(), // Deadline maps to endDate in payload
  status: z.enum(["pending", "todo", "in_progress", "complete", "archived"]).optional().default("todo"),
  description: z.string().optional().nullable(),
  referenceFile: z.string().url("Invalid reference URL").optional().nullable(),
});

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .min(3, "Project name must be at least 3 characters"),
  clientIds: z.array(z.string()).min(1, "At least one client is required"),
  employeeIds: z.array(z.string()).optional().default([]),
  requirements: z.array(requirementSchema).optional().default([]),
});
