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
import Button from "../../components/common/button";
import ConfirmDialog from "../../components/common/confirm-dialog";
import FormModal from "../../components/common/popup-modal";
import RequirementFilter from "../../components/common/requirement-filter";
import Pagination from "../../components/common/pagination";
import Table from "../../components/common/table";
import SearchInput from "../../components/common/search-input";

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
  "Social Media Post": "bg-emerald-50 text-emerald-600",
  Banners: "bg-sky-50 text-sky-600",
  "Landing Page": "bg-violet-50 text-violet-600",
  "Ad Creative": "bg-pink-50 text-pink-600",
  Prototype: "bg-amber-50 text-amber-600",
};

const statusStyles = {
  "In Progress": "bg-blue-50 text-blue-600",
  Todo: "bg-slate-100 text-slate-500",
  "In Review": "bg-orange-50 text-orange-600",
  Approved: "bg-emerald-50 text-emerald-600",
  Archived: "bg-gray-100 text-gray-400",
};

const initialRequirements = [
  {
    id: "req-1",
    requirement: "Brand Identity Refresh",
    type: "Logo",
    deadline: "Nov 12, 2024",
    status: "In Progress",
    description:
      "Refresh the mobile app brand identity with a simplified icon set, updated logomark usage, and color pairings that improve legibility across onboarding and dashboard screens.",
    archived: false,
  },
  {
    id: "req-2",
    requirement: "Q4 Instagram Campaign",
    type: "Social Media Post",
    deadline: "Nov 15, 2024",
    status: "Todo",
    description:
      "Create a 6-post Instagram campaign highlighting the redesign rollout, product value points, and a teaser carousel for the updated customer experience.",
    archived: false,
  },
  {
    id: "req-3",
    requirement: "Website Hero Section",
    type: "Banners",
    deadline: "Nov 18, 2024",
    status: "In Review",
    description:
      "Design a responsive homepage hero section with new headline options, supporting art direction, and CTA placements that align with the product refresh.",
    archived: false,
  },
  {
    id: "req-4",
    requirement: "Product Launch Site",
    type: "Landing Page",
    deadline: "Nov 20, 2024",
    status: "Approved",
    description:
      "Build the launch landing page UI concept with a modular section system, feature story blocks, testimonial treatment, and conversion-focused footer layout.",
    archived: false,
  },
  {
    id: "req-5",
    requirement: "Display Network Set",
    type: "Ad Creative",
    deadline: "Nov 22, 2024",
    status: "In Progress",
    description:
      "Prepare a display ad set in standard campaign sizes with one master concept adapted for brand, acquisition, and retargeting audiences.",
    archived: false,
  },
  {
    id: "req-6",
    requirement: "Checkout Micro Interactions",
    type: "Prototype",
    deadline: "Nov 26, 2024",
    status: "Archived",
    description:
      "Prototype motion and interaction cues for the checkout journey, including success states, validation feedback, and reduced friction patterns.",
    archived: true,
  },
];

const requirementTypeOptions = [
  "Logo",
  "Social Media Post",
  "Banners",
  "Landing Page",
  "Ad Creative",
  "Prototype",
];
const requirementStatusOptions = ["Todo", "In Progress", "In Review", "Approved", "Archived"];
const REQUIREMENTS_PER_PAGE = 5;

const employeeWindowSize = 2;
const clientWindowSize = 2;

const AgencyProjectDetail = () => {
  const [clientIndex, setClientIndex] = useState(0);
  const [employeeStartIndex, setEmployeeStartIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [requirements, setRequirements] = useState(initialRequirements);
  const [isAddRequirementOpen, setIsAddRequirementOpen] = useState(false);
  const [filters, setFilters] = useState({ type: "", status: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [requirementToArchive, setRequirementToArchive] = useState(null);
  const maxClientIndex = Math.max(
    0,
    Math.floor((projectClients.length - 1) / clientWindowSize) * clientWindowSize,
  );
  const maxEmployeeIndex = Math.max(
    0,
    Math.floor((employeeTeam.length - 1) / employeeWindowSize) * employeeWindowSize,
  );
  const isClientPrevDisabled = clientIndex === 0;
  const isClientNextDisabled = clientIndex >= maxClientIndex;
  const isEmployeePrevDisabled = employeeStartIndex === 0;
  const isEmployeeNextDisabled = employeeStartIndex >= maxEmployeeIndex;

  const visibleEmployees = useMemo(() => {
    return employeeTeam.slice(
      employeeStartIndex,
      employeeStartIndex + employeeWindowSize,
    );
  }, [employeeStartIndex]);

  const visibleClients = useMemo(() => {
    return projectClients.slice(clientIndex, clientIndex + clientWindowSize);
  }, [clientIndex]);

  const filteredRequirements = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return requirements.filter((item) => {
      const matchesSearch =
        !query ||
        [item.requirement, item.type, item.status].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesType = !filters.type || item.type === filters.type;
      const matchesStatus = !filters.status || item.status === filters.status;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [requirements, searchTerm, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ type: "", status: "" });
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequirements.length / REQUIREMENTS_PER_PAGE),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters.type, filters.status]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRequirements = useMemo(() => {
    const startIndex = (currentPage - 1) * REQUIREMENTS_PER_PAGE;
    return filteredRequirements.slice(startIndex, startIndex + REQUIREMENTS_PER_PAGE);
  }, [filteredRequirements, currentPage]);

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

  const handleArchive = (id) => {
    setRequirements((current) =>
      current.map((item) =>
        item.id === id ? { ...item, archived: true, status: "Archived" } : item,
      ),
    );
  };

  const handleCreateRequirement = (formData) => {
    const formattedDeadline = new Date(formData.deadline).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      },
    );

    setRequirements((current) => [
      {
        id: `req-${current.length + 1}`,
        requirement: formData.requirement,
        deadline: formattedDeadline,
        type: formData.type,
        description: formData.description,
        referenceFileName: formData.referenceFile?.[0]?.name || "",
        status: "Todo",
        archived: false,
      },
      ...current,
    ]);
  };

  return (
    <>
      <div className="min-h-screen bg-[#f7f8fc] p-4 md:p-6">
        <div className="w-full max-w-full overflow-x-hidden">
          <div className="flex flex-row justify-between items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-heading text-slate-900">
                {initialProject.name}
              </h1>
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
                      {projectClients.length} clients
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

              <div className="mt-4 min-h-[104px] divide-y divide-slate-100 text-sm text-slate-500">
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
                    <p className="text-xs text-slate-400">{employeeTeam.length} employees</p>
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

              <div className="mt-4 min-h-[94px] divide-y divide-slate-100">
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
                  <span className="px-3 py-1 bg-gray-200 text-xs rounded-xl ml-3">
                    {filteredRequirements.length} Total
                  </span>
                </h2>
                <p className="mt-2 text-xs md:text-sm text-gray-400">
                  {initialProject.subtitle}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <SearchInput
                  value={searchTerm}
                  onDebouncedChange={setSearchTerm}
                  delay={1000}
                  placeholder="Search requirements..."
                  className="w-full sm:w-72"
                />
                <RequirementFilter
                  filters={filters}
                  typeOptions={requirementTypeOptions}
                  statusOptions={requirementStatusOptions}
                  onChange={handleFilterChange}
                  onClear={handleClearFilters}
                />
              </div>
            </div>

            {filteredRequirements.length > 0 ? (
              <>
                <div className="w-full max-w-full">
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-max">
                      <Table
                        data={paginatedRequirements}
                        columns={requirementColumns}
                        renderActions
                        actionsHeaderLabel="Actions"
                        renderActionsCell={(item) => (
                          <button
                            type="button"
                            onClick={() => {
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
              <div className="bg-white rounded-xl p-8 shadow-sm flex items-center justify-center">
                <p className="text-gray-500">No requirements found</p>
              </div>
            )}
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
        onConfirm={() => {
          if (requirementToArchive) {
            handleArchive(requirementToArchive.id);
          }
          setRequirementToArchive(null);
        }}
        onCancel={() => setRequirementToArchive(null)}
        confirmButtonText="Archive"
        confirmButtonColor="bg-slate-900 hover:bg-slate-800"
      />

      <FormModal
        isOpen={isAddRequirementOpen}
        onClose={() => setIsAddRequirementOpen(false)}
        title="New Requirement"
        onSubmit={handleCreateRequirement}
        submitText="Create Requirement"
        maxWidth="max-w-2xl"
        showCancelButton
        contentClassName="space-y-1"
        renderContent={({ register }) => (
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="requirement-deadline" className="text-sm text-gray-600">
                  Deadline
                </label>
                <input
                  id="requirement-deadline"
                  type="date"
                  {...register("deadline", { required: true })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="requirement-type" className="text-sm text-gray-600">
                  Type
                </label>
                <div className="relative">
                  <select
                    id="requirement-type"
                    {...register("type", { required: true })}
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
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="reference-file" className="text-sm text-gray-600">
                Reference File
              </label>
              <input
                id="reference-file"
                type="file"
                {...register("referenceFile")}
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
                {...register("description", { required: true })}
                className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </>
        )}
      />
    </>
  );
};

export default AgencyProjectDetail;
