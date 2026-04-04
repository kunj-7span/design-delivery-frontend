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
  const response = await axiosClient.get("/agency/dashboard/client-growth?period=monthly&year=2026");

  const rawData = response.data?.data?.data || [];

  return rawData.map((item) => ({
    name: item.month,
    clients: item.clients,
  }));
};