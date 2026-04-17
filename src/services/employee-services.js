import axiosClient from "../api/axios-client.js";

export const getEmployeeProjects = async ({
  tab,
  page = 1,
  limit = 10,
  search = "",
  status,
  sort,
  order,
} = {}) => {
  const params = new URLSearchParams();
  if (tab) params.append("tab", tab);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (sort) params.append("sort", sort);
  if (order) params.append("order", order);

  const response = await axiosClient.get(`/employee/projects?${params.toString()}`);
  return response.data;
};

export const getEmployeeProjectSummary = async (projectId) => {
  const response = await axiosClient.get(`/employee/projects/${projectId}`);
  return response.data;
};

export const getEmployeeProjectRequirements = async (
  projectId,
  { page = 1, limit = 10, search = "", status, sort, order } = {}
) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (sort) params.append("sort", sort);
  if (order) params.append("order", order);

  const response = await axiosClient.get(
    `/employee/projects/${projectId}/requirements?${params.toString()}`
  );
  return response.data;
};
