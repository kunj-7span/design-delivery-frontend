import React, { useEffect, useMemo, useState } from "react";
import {
  Archive,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  UsersRound,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/button";
import ConfirmDialog from "../../components/common/confirm-dialog";
import FormModal from "../../components/common/popup-modal";
import InfoModal from "../../components/common/info-modal";
import Pagination from "../../components/common/pagination";
import RequirementFilter from "../../components/common/requirement-filter";
import SearchInput from "../../components/common/search-input";
import Table from "../../components/common/table";
import { createRequirementSchema } from "../../schema/agency-schema";
import { authServices } from "../../services/auth-services";
import {
  archiveProjectRequirement,
  createProjectRequirement,
  getProjectById,
  getProjectRequirements,
} from "../../services/agency-services";

const initialProject = {
  id: "project-1",
  name: "Mobile App Redesign",
  subtitle: "Review project specifications and tracking progress",
};

const projectClients = [
  {
    id: "client-1",
    company: "Acme Global Corporation",
    contactName: "Sarah Thompson",
    role: "Product Lead",
    email: "sarah.t@example.com",
  },
  {
    id: "client-2",
    company: "Northwind Labs",
    contactName: "Daniel Brooks",
    role: "Marketing Head",
    email: "daniel.b@northwind.com",
  },
  {
    id: "client-3",
    company: "Nimbus Retail",
    contactName: "Emma Lewis",
    role: "Brand Manager",
    email: "emma@nimbusretail.com",
  },
];

const employeeTeam = [
  { id: "emp-1", name: "Alex Rivera" },
  { id: "emp-2", name: "Sarah Chen" },
  { id: "emp-3", name: "Jordan Kim" },
  { id: "emp-4", name: "Maya Patel" },
];

const typeStyles = {
  Logo: "bg-indigo-50 text-indigo-600",
  "Social Media": "bg-emerald-50 text-emerald-600",
  Branding: "bg-cyan-50 text-cyan-700",
  "Web Design": "bg-violet-50 text-violet-700",
  "Ui Design": "bg-fuchsia-50 text-fuchsia-700",
  Development: "bg-blue-50 text-blue-700",
  Content: "bg-amber-50 text-amber-700",
  Marketing: "bg-rose-50 text-rose-700",
  Other: "bg-slate-100 text-slate-600",
};

const statusStyles = {
  In_Progress: "bg-blue-50 text-blue-600",
  Todo: "bg-slate-100 text-slate-500",
  Complete: "bg-emerald-50 text-emerald-600",
  In_Review: "bg-orange-50 text-orange-600",
  Approved: "bg-emerald-50 text-emerald-600",
  Archived: "bg-gray-100 text-gray-400",
};

const requirementTypeOptions = ["logo", "branding", "social_media", "ui_design", "web_design", "development", "content", "marketing", "other"];
const requirementStatusOptions = ["todo", "in_progress", "complete", "archived"];
const REQUIREMENTS_PER_PAGE = 5;

const employeeWindowSize = 2;
const clientWindowSize = 2;

const AgencyProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(initialProject);
  const [projectClientsData, setProjectClientsData] = useState(projectClients);
  const [employeeTeamData, setEmployeeTeamData] = useState(employeeTeam);
  const [clientIndex, setClientIndex] = useState(0);
  const [employeeStartIndex, setEmployeeStartIndex] = useState(0);
  const [requirements, setRequirements] = useState([]);
  const [totalRequirements, setTotalRequirements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddRequirementOpen, setIsAddRequirementOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: "", status: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [requirementToArchive, setRequirementToArchive] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [referenceUploadMeta, setReferenceUploadMeta] = useState(null);
  const maxClientIndex = Math.max(
    0,
    Math.floor((projectClientsData.length - 1) / clientWindowSize) * clientWindowSize,
  );
  const maxEmployeeIndex = Math.max(
    0,
    Math.floor((employeeTeamData.length - 1) / employeeWindowSize) * employeeWindowSize,
  );
  const isClientPrevDisabled = clientIndex === 0;
  const isClientNextDisabled = clientIndex >= maxClientIndex;
  const isEmployeePrevDisabled = employeeStartIndex === 0;
  const isEmployeeNextDisabled = employeeStartIndex >= maxEmployeeIndex;

  const visibleEmployees = useMemo(() => {
    return employeeTeamData.slice(
      employeeStartIndex,
      employeeStartIndex + employeeWindowSize,
    );
  }, [employeeStartIndex, employeeTeamData]);

  const visibleClients = useMemo(() => {
    return projectClientsData.slice(clientIndex, clientIndex + clientWindowSize);
  }, [clientIndex, projectClientsData]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters.status, filters.type]);

  const formatLabel = (value = "") =>
    value
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const fetchProjectRequirements = async (page = currentPage) => {
    if (!projectId) return;

    try {
      const response = await getProjectRequirements(projectId, {
        page,
        limit: REQUIREMENTS_PER_PAGE,
        search: searchTerm.trim(),
        status: filters.status || undefined,
        type: filters.type || undefined,
      });

      const requirementsList = response?.data || [];

      setRequirements(
        requirementsList.map((item) => ({
          id: item.id,
          requirement: item.title,
          type: formatLabel(item.type || "other"),
          deadline: item.deadline
            ? new Date(item.deadline).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
            : "-",
          status: formatLabel(item.status || "todo"),
          description: item.description || "",
          referenceFile: item.referenceFile || "",
          archived: item.status === "archived",
        })),
      );

      setTotalRequirements(response?.meta?.filteredRequirements || requirementsList.length);
      setTotalPages(response?.meta?.totalPages || 1);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load project requirements",
      );
    }
  };

  const fetchProjectDetail = async () => {
    if (!projectId) return;

    try {
      const response = await getProjectById(projectId);
      const projectData = response?.data || {};

      setProject((current) => ({
        ...current,
        id: projectData?.id || current.id,
        name: projectData?.name || current.name,
      }));

      setProjectClientsData(
        (projectData?.clients || []).map((client) => ({
          id: client.id,
          contactName: client.name,
          email: client.email,
        })),
      );

      setEmployeeTeamData(
        (projectData?.employees || []).map((employee) => ({
          id: employee.id,
          name: employee.name,
        })),
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load project details");
    }
  };

  useEffect(() => {
    fetchProjectDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    fetchProjectRequirements(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, currentPage, searchTerm, filters.status, filters.type]);

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ type: "", status: "" });
  };

  const requirementColumns = useMemo(
    () => [
      {
        key: "requirement",
        label: "Requirement",
        cellClassName: "px-6 py-4 text-gray-700 whitespace-nowrap font-semibold",
        render: (value, item) => (
          <span className={item.archived ? "line-through text-slate-400" : ""}>
            {value}
          </span>
        ),
      },
      {
        key: "type",
        label: "Type",
        render: (value, item) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${typeStyles[value] || "bg-slate-100 text-slate-500"
              } ${item.archived ? "opacity-45" : ""}`}
          >
            {value}
          </span>
        ),
      },
      { key: "deadline", label: "Deadline" },
      {
        key: "status",
        label: "Status",
        render: (value) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${statusStyles[value] || "bg-slate-100 text-slate-500"
              }`}
          >
            {value}
          </span>
        ),
      },
    ],
    [],
  );

  const handleArchive = async (requirementId) => {
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    try {
      const response = await archiveProjectRequirement(projectId, requirementId);
      toast.success(response?.message || "Requirement archived successfully");
      fetchProjectRequirements(currentPage);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to archive requirement",
      );
    }
  };

  const handleCreateRequirement = async (formData) => {
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    let referenceFileUrl = "";
    const selectedReferenceFile = formData.referenceFile?.[0];

    if (selectedReferenceFile) {
      try {
        const uploadMeta =
          referenceUploadMeta &&
            referenceUploadMeta.fileName === selectedReferenceFile.name &&
            referenceUploadMeta.contentType === selectedReferenceFile.type
            ? referenceUploadMeta
            : null;

        if (!uploadMeta?.uploadUrl || !uploadMeta?.fileUrl) {
          toast.error("Please reselect reference file");
          return;
        }

        await authServices.uploadFileToS3(
          uploadMeta.uploadUrl,
          selectedReferenceFile,
          selectedReferenceFile.type,
        );
        referenceFileUrl = uploadMeta.fileUrl;
      } catch (error) {
        toast.error("Failed to upload reference file");
        return;
      }
    }

    const payload = {
      title: formData.requirement.trim(),
      type: formData.type.toLowerCase(),
      description: formData.description?.trim() || "",
      referenceFile: referenceFileUrl || null,
      deadline: `${formData.deadline}T23:59:59Z`,
    };

    try {
      const response = await createProjectRequirement(projectId, payload);

      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchProjectRequirements(1);
      }

      setReferenceUploadMeta(null);
      toast.success(response?.message || "Requirement created successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create requirement",
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#f7f8fc] p-4 md:p-6">
        <div className="w-full max-w-full overflow-x-hidden">
          <div className="flex flex-row justify-between items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-heading text-slate-900">{project.name}</h1>
            </div>

            {/* <div className="flex flex-wrap gap-3"> */}
            {/* <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
              >
                <FolderOpen size={16} />
                Edit Project
              </button> */}
            <Button
              type="button"
              onClick={() => setIsAddRequirementOpen(true)}
              className="bg-primary px-4 py-2 text-sm text-white shadow-lg shadow-indigo-200 hover:bg-hover-primary"
            >
              + New Requirement
            </Button>
            {/* </div> */}
          </div>

          <div className="mt-5 flex gap-5 flex-wrap justify-center sm:justify-start">
            <section className="rounded-xl bg-white max-w-90 p-4 shadow-sm md:p-6">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-50 p-2.5 text-primary">
                    <BriefcaseBusiness size={17} />
                  </div>
                  <div>
                    <h2 className="text-subheading font-semibold text-slate-900">
                      Project Clients
                    </h2>
                    <p className="text-xs text-slate-400">
                      {projectClientsData.length} clients
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isClientPrevDisabled}
                    onClick={() =>
                      setClientIndex(
                        (current) => Math.max(0, current - clientWindowSize),
                      )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-300"
                    aria-label="Previous client"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={isClientNextDisabled}
                    onClick={() =>
                      setClientIndex(
                        (current) =>
                          Math.min(maxClientIndex, current + clientWindowSize),
                      )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-300"
                    aria-label="Next client"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4 min-h-26 divide-y divide-slate-100 text-sm text-slate-500">
                {visibleClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center gap-2.5 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                      {client.contactName
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">{client.contactName}</p>
                      <p className="text-xs">{client.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-white p-4 shadow-sm md:p-6">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-fuchsia-50 p-2.5 text-fuchsia-500">
                    <UsersRound size={17} />
                  </div>
                  <div>
                    <h2 className="mt-1 text-subheading font-semibold text-slate-900">
                      Team Members
                    </h2>
                    <p className="text-xs text-slate-400">{employeeTeamData.length} employees</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isEmployeePrevDisabled}
                    onClick={() =>
                      setEmployeeStartIndex(
                        (current) => Math.max(0, current - employeeWindowSize),
                      )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-300"
                    aria-label="Previous employee"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={isEmployeeNextDisabled}
                    onClick={() =>
                      setEmployeeStartIndex(
                        (current) =>
                          Math.min(maxEmployeeIndex, current + employeeWindowSize),
                      )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-300"
                    aria-label="Next employee"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4 min-h-23 divide-y divide-slate-100">
                {visibleEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                      {employee.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {employee.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-5 bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-4">
              <div>
                <h2 className="flex items-center text-subheading font-semibold text-gray-800">
                  <span>All Requirements</span>
                  <span className="px-3 py-1.5 bg-gray-200 text-xs rounded-xl ml-3">
                    {totalRequirements} Total
                  </span>
                </h2>
                <p className="mt-2 text-xs md:text-sm text-gray-400">
                  {initialProject.subtitle}
                </p>
              </div>

              <div className="w-full flex flex-col sm:flex-row gap-2 md:w-auto md:items-center">
                <div className="w-full md:w-72">
                  <SearchInput
                    value={searchTerm}
                    onDebouncedChange={setSearchTerm}
                    delay={700}
                    placeholder="Search requirements..."
                  />
                </div>
                <RequirementFilter
                  filters={filters}
                  typeOptions={requirementTypeOptions}
                  statusOptions={requirementStatusOptions}
                  onChange={handleFilterChange}
                  onClear={handleClearFilters}
                />
              </div>
            </div>

            <div className="min-h-23">
              {requirements.length > 0 ? (
                <>
                  <div className="w-full max-w-full">
                    <div className="w-full overflow-x-auto">
                      <div className="min-w-max">
                        <Table
                          data={requirements}
                          columns={requirementColumns}
                          onRowClick={(item) => setSelectedRequirement(item)}
                          isRowClickable={(item) => !item.archived}
                          renderActions
                          actionsHeaderLabel="Actions"
                          renderActionsCell={(item) => (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                if (item.archived) return;
                                setRequirementToArchive(item);
                              }}
                              disabled={item.archived}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-300"
                            >
                              <Archive size={14} />
                              {item.archived ? "Archived" : "Archive"}
                            </button>
                          )}
                          rowClassName={(item) =>
                            item.archived
                              ? "bg-slate-50 text-slate-300"
                              : "hover:bg-gray-50 bg-white"
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      if (page < 1 || page > totalPages) return;
                      setCurrentPage(page);
                    }}
                  />
                </>
              ) : (
                <div className="h-full min-h-90 bg-white rounded-xl p-8 shadow-sm flex items-center justify-center">
                  <p className="text-gray-500">No requirements found</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(requirementToArchive)}
        title="Archive requirement?"
        message={
          requirementToArchive
            ? `Are you sure you want to archive "${requirementToArchive.requirement}"?`
            : ""
        }
        onConfirm={async () => {
          if (requirementToArchive) {
            await handleArchive(requirementToArchive.id);
          }
          setRequirementToArchive(null);
        }}
        onCancel={() => setRequirementToArchive(null)}
        confirmButtonText="Archive"
        confirmButtonColor="bg-slate-900 hover:bg-slate-800"
      />

      <InfoModal
        isOpen={Boolean(selectedRequirement)}
        onClose={() => setSelectedRequirement(null)}
        title="Requirement Details"
        items={[
          { label: "Name", value: selectedRequirement?.requirement },
          { label: "Type", value: selectedRequirement?.type },
          { label: "Deadline", value: selectedRequirement?.deadline },
          { label: "Status", value: selectedRequirement?.status },
          {
            label: "Description",
            value: selectedRequirement?.description,
            fullWidth: true,
          },
          {
            label: "Reference Link",
            value: selectedRequirement?.referenceFile,
            isLink: true,
            linkText: selectedRequirement?.referenceFile ? "Open reference file" : "-",
            fullWidth: true,
          },
        ]}
      />

      <FormModal
        isOpen={isAddRequirementOpen}
        onClose={() => setIsAddRequirementOpen(false)}
        title="New Requirement"
        onSubmit={handleCreateRequirement}
        schema={createRequirementSchema}
        submitText="Create Requirement"
        maxWidth="max-w-2xl"
        showCancelButton
        contentClassName="space-y-1"
        renderContent={({ register, errors }) => (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="requirement-name" className="text-sm text-gray-600">
                Requirement Name
              </label>
              <input
                id="requirement-name"
                type="text"
                placeholder="e.g. Navigation Micro-interactions"
                {...register("requirement", { required: true })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.requirement && (
                <p className="text-xs text-red-500">{errors.requirement.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="requirement-deadline" className="text-sm text-gray-600">
                  Deadline
                </label>
                <input
                  id="requirement-deadline"
                  type="date"
                  {...register("deadline")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.deadline && (
                  <p className="text-xs text-red-500">{errors.deadline.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="requirement-type" className="text-sm text-gray-600">
                  Type
                </label>
                <div className="relative">
                  <select
                    id="requirement-type"
                    {...register("type")}
                    defaultValue=""
                    className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    {requirementTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
                  />
                </div>
                {errors.type && (
                  <p className="text-xs text-red-500">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="reference-file" className="text-sm text-gray-600">
                Reference File
              </label>
              <input
                id="reference-file"
                type="file"
                {...register("referenceFile", {
                  onChange: async (event) => {
                    const file = event?.target?.files?.[0];

                    if (!file) {
                      setReferenceUploadMeta(null);
                      return;
                    }

                    try {
                      const response = await authServices.generateUploadUrl(
                        file.name,
                        file.type,
                        "user/reference",
                      );
                      const { uploadUrl, fileUrl } = response?.data || {};

                      if (!uploadUrl || !fileUrl) {
                        throw new Error("Invalid upload URL response");
                      }

                      setReferenceUploadMeta({
                        fileName: file.name,
                        contentType: file.type,
                        uploadUrl,
                        fileUrl,
                      });
                    } catch (error) {
                      setReferenceUploadMeta(null);
                      toast.error(
                        error?.message || "Failed to prepare reference file upload",
                      );
                    }
                  },
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="requirement-description" className="text-sm text-gray-600">
                Description
              </label>
              <textarea
                id="requirement-description"
                rows={5}
                placeholder="Provide detailed specifications for this requirement..."
                {...register("description")}
                className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
          </>
        )}
      />
    </>
  );
};

export default AgencyProjectDetail;
