import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "../../schema/project-schema";
import InputField from "../common/input-field";
import TagInput from "../common/tag-input";
import SelectField from "../common/select-field";
import TextareaField from "../common/textarea-field";
import Button from "../common/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getEmployeesForSelect,
  getClientsForSelect,
  createProject,
} from "../../services/agency-services";
import {
  CircleDot,
  Users,
  ClipboardList,
  PlusCircle,
  Rocket,
  Trash2,
} from "lucide-react";

const requirementTypes = [
  { value: "logo", label: "Logo" },
  { value: "banner", label: "Banner" },
  { value: "icon", label: "Icon" },
  { value: "brochure", label: "Brochure" },
  { value: "social_media", label: "Social Media" },
  { value: "website", label: "Website" },
  { value: "other", label: "Other" },
];

const CreateProjectForm = () => {
  const navigate = useNavigate();

  const [workMode, setWorkMode] = useState("assigned");
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      clientIds: [],
      employeeIds: [],
      requirements: [{ title: "", type: "", deadline: "", description: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements",
  });

  const handleWorkModeChange = (mode) => {
    if (mode === workMode) return;
    setWorkMode(mode);
    setClients([]);
    setEmployees([]);
    reset({
      name: "",
      clientIds: [],
      employeeIds: [],
      requirements: [{ title: "", type: "", deadline: "", description: "" }],
    });
  };

  // Fetch employees and clients on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployeesForSelect();
        setEmployeeOptions(data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      }
    };
    const fetchClients = async () => {
      try {
        const data = await getClientsForSelect();
        setClientOptions(data);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      }
    };
    fetchEmployees();
    fetchClients();
  }, []);

  // Tag handlers for clients (object tags — selected from dropdown)
  const handleAddClient = (opt) => {
    // opt is { id, name }
    if (!clients.some((c) => c.id === opt.id)) {
      const updated = [...clients, opt];
      setClients(updated);
      setValue(
        "clientIds",
        updated.map((c) => c.id)
      );
      clearErrors("clientIds");
    }
  };

  const handleRemoveClient = (index) => {
    const updated = clients.filter((_, i) => i !== index);
    setClients(updated);
    setValue(
      "clientIds",
      updated.map((c) => c.id)
    );
  };

  // Tag handlers for employees (object tags — selected from dropdown)
  const handleAddEmployee = (opt) => {
    // opt is { id, name }
    if (!employees.some((e) => e.id === opt.id)) {
      const updated = [...employees, opt];
      setEmployees(updated);
      setValue(
        "employeeIds",
        updated.map((e) => e.id)
      );
      clearErrors("employeeIds");
    }
  };

  const handleRemoveEmployee = (index) => {
    const updated = employees.filter((_, i) => i !== index);
    setEmployees(updated);
    setValue(
      "employeeIds",
      updated.map((e) => e.id)
    );
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        workMode,
        clientIds: data.clientIds,
      };

      // Only include employeeIds for assigned mode
      if (workMode === "assigned") {
        if (!data.employeeIds || data.employeeIds.length === 0) {
          setError("employeeIds", {
            type: "manual",
            message: "At least one employee is required for assigned projects.",
          });
          return;
        }
        payload.employeeIds = data.employeeIds;
      }

      await createProject(payload);
      toast.success("Project created successfully!");

      // Navigate back after a brief delay so the user sees the toast
      setTimeout(() => {
        navigate("/agency/agency-projects");
      }, 1500);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create project.";
      setError("root", { type: "server", message });
      toast.error(message);
    }
  };

  return (
    <>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
        {/* HEADER */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-heading text-xl md:text-2xl font-bold text-gray-900">
            Create New Project
          </h1>
          <p className="text-small text-gray-500 mt-1">
            Define the scope, assign your creative team, and set deliverables.
          </p>
        </div>

        {/* WORK MODE TOGGLE */}
        <div className="flex justify-start mb-8 md:mb-10">
          <div className="bg-white border border-gray-200 p-1 rounded-2xl flex gap-1 shadow-sm">
            <button
              type="button"
              onClick={() => handleWorkModeChange("public")}
              className={`px-5 sm:px-6 py-2 text-sm rounded-xl transition-all duration-200 cursor-pointer ${workMode === "public"
                ? "bg-primary hover:bg-hover-primary text-white font-medium shadow"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Public
            </button>
            <button
              type="button"
              onClick={() => handleWorkModeChange("assigned")}
              className={`px-5 sm:px-6 py-2 text-sm rounded-xl transition-all duration-200 cursor-pointer ${workMode === "assigned"
                ? "bg-primary hover:bg-hover-primary text-white font-medium shadow"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Assigned
            </button>
          </div>
        </div>

        {errors.root && (
          <div className="p-3 bg-red-100 text-red-600 rounded-xl text-sm text-center mb-6">
            {errors.root.message}
          </div>
        )}

        {/* BASIC INFO */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm border border-gray-100 mb-5 md:mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
              <CircleDot size={18} className="text-primary" />
            </div>
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              Basic Information
            </h2>
          </div>

          <div className="space-y-5">
            <InputField
              label="Project Name"
              id="name"
              type="text"
              placeholder="e.g. Q4 Brand Refresh - Global Campaign"
              error={errors.name}
              {...register("name")}
            />

            <TagInput
              label="Clients"
              id="clientIds"
              tags={clients}
              onAddTag={handleAddClient}
              onRemoveTag={handleRemoveClient}
              placeholder="Search and select clients..."
              error={errors.clientIds}
              tagColor="bg-primary"
              options={clientOptions}
            />
          </div>
        </div>

        {/* TEAM ASSIGNMENT (only for Assigned mode) */}
        {workMode === "assigned" && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm border border-gray-100 mb-5 md:mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-md bg-amber-50 flex items-center justify-center">
                <Users size={18} className="text-amber-600" />
              </div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900">
                Team Assignment
              </h2>
            </div>

            <TagInput
              label="Employees"
              id="employeeIds"
              tags={employees}
              onAddTag={handleAddEmployee}
              onRemoveTag={handleRemoveEmployee}
              placeholder="Search and select employees..."
              error={errors.employeeIds}
              tagColor="bg-gray-700"
              options={employeeOptions}
            />
          </div>
        )}

        {/*PROJECT REQUIREMENTS */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm border border-gray-100 mb-5 md:mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center">
                <ClipboardList size={18} className="text-blue-600" />
              </div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900">
                Project Requirements
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                append({ title: "", type: "", deadline: "", description: "" })
              }
              className="flex items-center gap-1.5 text-primary text-sm font-medium hover:text-hover-primary transition-colors cursor-pointer"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Add Requirement</span>
            </button>
          </div>

          <div className="space-y-8">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={`${index > 0 ? "pt-6 border-t border-gray-100" : ""}`}
              >
                {/* Remove button for extra requirements */}
                {fields.length > 1 && (
                  <div className="flex justify-end mb-3">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                )}

                {/* Title, Type, Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <InputField
                    label="Requirement Title"
                    id={`req-title-${index}`}
                    type="text"
                    placeholder="Visual Identity Design"
                    error={errors.requirements?.[index]?.title}
                    {...register(`requirements.${index}.title`)}
                  />

                  <SelectField
                    label="Type"
                    id={`req-type-${index}`}
                    options={requirementTypes}
                    placeholder="Select type"
                    error={errors.requirements?.[index]?.type}
                    {...register(`requirements.${index}.type`)}
                  />

                  <InputField
                    label="Deadline"
                    id={`req-deadline-${index}`}
                    type="date"
                    placeholder="mm/dd/yy"
                    error={errors.requirements?.[index]?.deadline}
                    {...register(`requirements.${index}.deadline`)}
                  />
                </div>

                {/* Description */}
                <TextareaField
                  label="Description"
                  id={`req-desc-${index}`}
                  rows={4}
                  placeholder="Enter detailed requirement scope and deliverables..."
                  error={errors.requirements?.[index]?.description}
                  {...register(`requirements.${index}.description`)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="px-6 py-3 bg-primary hover:bg-hover-primary text-white text-sm gap-2"
          >
            <Rocket size={16} />
            Create Project
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreateProjectForm;
