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
export const getClientInvitations = async () => {
  const response = await axiosClient.get("/agency/client-invitations");

  const invitations = response.data?.data?.invitations || [];

  return invitations.map((inv) => ({
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
  }));
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
export const getEmployees = async () => {
  const response = await axiosClient.get("/employee-profiles");

  const employees = response.data?.data || [];

  return employees.map((emp) => ({
    id: emp.id,
    name: emp.name,
    email: emp.email,
    date: new Date(emp.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    }),
    activeProjects: emp.activeProjectsCount || 0,
  }));
};

export const addEmployee = async (formData) => {
  const response = await axiosClient.post("/employee-profiles", {
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
  await axiosClient.delete(`/employee-profiles/${employeeId}`);
  return true;
};

// Employees for select dropdown (id + name)
export const getEmployeesForSelect = async () => {
  const response = await axiosClient.get("/employee-profiles");
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
  console.log("Raw clients response:", response.data);
  console.log("Fetched clients for select:", clients);
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
