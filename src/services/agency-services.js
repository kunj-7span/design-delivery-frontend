import axiosClient from "../api/axios-client.js";

export const getAgencySummary = async () => {
  const response = await axiosClient.get("/agency/dashboard/summary");

  const data = response.data?.data;

  return {
    projects: data?.totalProjects || 0,
    clients: data?.totalClients || 0,
    employees: data?.totalEmployees || 0,
  };
};

export const getClientGrowth = async () => {
  const response = await axiosClient.get(
    "/agency/dashboard/client-growth?period=monthly&year=2026",
  );

  const rawData = response.data?.data?.data || [];

  return rawData.map((item) => ({
    name: item.month,
    clients: item.clients,
  }));
};

// Client API Calls
export const getClientInvitations = async ({
  page = 1,
  limit = 10,
  status,
} = {}) => {
  const response = await axiosClient.get("/agency/client-invitations", {
    params: { page, limit, status },
  });

  const invitations = response.data?.data?.invitations || [];

  return {
    data: invitations.map((inv) => ({
      id: inv.id,
      clientName: inv.client_name || "Unknown",
      email: inv.receiver_email,
      date: new Date(inv.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      }),
      status: inv.status,
      isAccepted: inv.is_accepted,
      expiresAt: inv.expires_at,
    })),
    meta: response.data?.meta || {}, // 👈 IMPORTANT
  };
};

export const inviteClient = async (formData) => {
  const response = await axiosClient.post("/agency/client-invitations", {
    client_name: formData.name,
    email: formData.email,
  });

  return response.data;
};

export const updateClient = async (clientId, formData) => {
  const response = await axiosClient.post(
    `/agency/client-invitations/${clientId}/resend`,
    {
      client_name: formData.name,
      email: formData.email,
    },
  );

  return response.data;
};

export const resendClientInvitation = async (clientId) => {
  const response = await axiosClient.post(
    `/agency/client-invitations/${clientId}/resend`,
  );

  return response.data;
};

export const deleteClientInvitation = async (clientId) => {
  const response = await axiosClient.delete(
    `/agency/client-invitations/${clientId}`,
  );

  return response.data;
};

// Employee API Calls
export const getEmployees = async ({ page = 1, limit = 10 } = {}) => {
  const response = await axiosClient.get("/agency/employee-profiles", {
    params: { page, limit },
  });

  const employees = response.data?.data || [];

  return {
    data: employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      date: new Date(emp.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      }),
      activeProjects: emp.activeProjectsCount || 0,
    })),
    meta: response.data?.meta || {}, // 👈 IMPORTANT
  };
};

export const addEmployee = async (formData) => {
  const response = await axiosClient.post("/agency/employee-profiles", {
    name: formData.name,
    email: formData.email,
  });

  const emp = response.data?.data;

  return {
    id: emp.id,
    name: emp.name,
    email: emp.email,
    date: new Date(emp.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    }),
    activeProjects: emp.activeProjectsCount || 0,
  };
};

export const deleteEmployee = async (employeeId) => {
  await axiosClient.delete(`/agency/employee-profiles/${employeeId}`);
  return true;
};

// Employees for select dropdown (id + name)
export const getEmployeesForSelect = async () => {
  const response = await axiosClient.get("/agency/employee-profiles");
  const employees = response.data?.data || [];

  return employees.map((emp) => ({
    id: emp.id,
    name: emp.name,
  }));
};

// Clients for select dropdown (id + name)
export const getClientsForSelect = async () => {
  const response = await axiosClient.get("/agency/client-invitations/clients");
  const clients = response.data?.data || [];
  return clients.map((client) => ({
    id: client.id,
    name: client.name,
  }));
};

// Create Project
export const createProject = async (payload) => {
  const response = await axiosClient.post("/agency/projects", payload);
  return response.data;
};

// Get Projects
export const getProjects = async ({
  workMode,
  status,
  page = 1,
  limit = 5,
} = {}) => {
  const params = new URLSearchParams();
  if (workMode) params.append("workMode", workMode);
  if (status) params.append("status", status);
  params.append("page", page);
  params.append("limit", limit);

  const response = await axiosClient.get(
    `/agency/projects?${params.toString()}`,
  );
  return response.data;
};

export const getProjectById = async (projectId) => {
  const response = await axiosClient.get(`/agency/projects/${projectId}`);
  return response.data;
};

export const createProjectRequirement = async (projectId, payload) => {
  const response = await axiosClient.post(
    `/agency/projects/${projectId}/requirements`,
    payload,
  );
  return response.data;
};

export const getProjectRequirements = async (
  projectId,
  { page = 1, limit = 5, search = "", status, type } = {},
) => {
  const response = await axiosClient.get(
    `/agency/projects/${projectId}/requirements`,
    {
      params: { page, limit, search, status, type },
    },
  );
  return response.data;
};

export const archiveProjectRequirement = async (projectId, requirementId) => {
  const response = await axiosClient.delete(
    `/agency/projects/${projectId}/requirements/${requirementId}`,
  );
  return response.data;
};

// Agency Settings API Calls
export const getUserProfile = async () => {
  const response = await axiosClient.get("/auth/me");
  const userData = response.data?.data;

  if (!userData) {
    throw new Error("Failed to fetch user profile");
  }

  const agencyData = userData.agency?.[0] || {};

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    mobile_no: userData.mobile_no || "",
    avatar: userData.avatar,
    website: agencyData.website || "",
    primary_industry: agencyData.primary_industry || "",
    address: agencyData.address || "",
  };
};

export const updateAgencySettings = async (payload) => {
  const response = await axiosClient.patch(
    "/agency/settings/details-update",
    payload,
  );

  return response.data;
};

export const resetAgencyPassword = async (passwordData) => {
  const response = await axiosClient.patch("/agency/settings/reset-password", {
    current_password: passwordData.current_password,
    password: passwordData.password,
    confirm_password: passwordData.confirm_password,
  });

  return response.data;
};
