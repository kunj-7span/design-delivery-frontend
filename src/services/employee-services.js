import axiosClient from "../api/axios-client.js";

export const getEmployeeDashboardSummary = async () => {
  const response = await axiosClient.get("/employee/dashboard/dashboard-summary");

  const data = response.data?.data?.data;

  return {
    activeProjects: data?.projectSummery?.activeProjects || 0,
    completedProjects: data?.projectSummery?.completedProjects || 0,
    overdueRequirements: data?.requirementsSummary?.overDueRequirements || 0,
    inProgressRequirements: data?.requirementsSummary?.inProgressRequirements || 0,
    approvedAssets: data?.assetsSummary?.approveAssets || 0,
  };
};

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

export const getRequirementAssets = async (projectId, requirementId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axiosClient.get(
    `/agency/projects/${projectId}/requirements/${requirementId}/assets?${query}`
  );
  return response.data;
};

// Step 1: Get S3 pre-signed upload URL
export const getAssetUploadUrl = async (projectId, requirementId, { fileName, contentType }) => {
  const response = await axiosClient.post(
    `/agency/projects/${projectId}/requirements/${requirementId}/assets/upload-url`,
    { fileName, contentType }
  );
  return response.data;
};

// Step 2: Upload file directly to S3 using pre-signed URL (no auth header needed - direct S3)
export const uploadFileToS3 = async (uploadUrl, file) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!response.ok) throw new Error("S3 upload failed");
  return true;
};

// Step 3: Save asset metadata to database
export const saveAssetMetadata = async (projectId, requirementId, { title, asset_link, internal_notes, asset_id }) => {
  const body = { title, asset_link, internal_notes };
  if (asset_id) body.asset_id = asset_id;
  const response = await axiosClient.post(
    `/agency/projects/${projectId}/requirements/${requirementId}/assets/upload`,
    body
  );
  return response.data;
};

// Get specific asset version details
export const getAssetVersionDetails = async (projectId, requirementId, assetId, versionNo) => {
  const response = await axiosClient.get(
    `/agency/projects/${projectId}/requirements/${requirementId}/assets/${assetId}/${versionNo}`
  );
  return response.data;
};

