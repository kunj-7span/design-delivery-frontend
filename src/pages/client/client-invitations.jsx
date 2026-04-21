import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axios-client";
import { Loader2, Mail, Calendar } from "lucide-react";
import Button from "../../components/common/button";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/auth-store";

const ClientInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchPendingInvitations();
  }, []);

  const fetchPendingInvitations = async () => {
    try {
      const response = await axiosClient.get("/agency/client-invitations/pending");

      if (response.data.success) {
        const data = response.data.data;

        if (Array.isArray(data)) {
          setInvitations(data);
        } else if (Array.isArray(data?.invitations)) {
          setInvitations(data.invitations);
        } else {
          setInvitations([]);
        }
      } else {
        setInvitations([]);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast.error("Failed to load invitations. Please try again.");
      setInvitations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      setAcceptingId(invitationId);

      const response = await axiosClient.post(
        `/agency/client-invitations/${invitationId}/accept`,
        {}
      );

      if (response.data.success) {
        toast.success("Invitation accepted successfully!");

        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      } else {
        toast.error(
          error.response?.data?.message ||
          "Failed to accept invitation. Please try again.",
        );
      }
    } finally {
      setAcceptingId(null);
    }
  };

  const safeInvitations = Array.isArray(invitations) ? invitations : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-gray-600 text-sm">Loading invitations...</p>
      </div>
    );
  }

  return (
    <div className="my-container py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invitations</h1>
        <p className="text-gray-600">
          Manage your project invitations from agencies
        </p>
      </div>

      {safeInvitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
          <Mail className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Invitations
          </h3>
          <p className="text-gray-600 text-sm text-center max-w-md">
            You don't have any pending invitations at the moment. When agencies
            invite you to projects, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {safeInvitations.map((invitation) => {
            const isExpired = new Date() > new Date(invitation.expires_at);

            return (
              <div
                key={invitation.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {invitation.agency_name || "Project Invitation"}
                      </h3>

                      {isExpired && (
                        <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          Expired
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {invitation.project_name && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Project:</span>{" "}
                          {invitation.project_name}
                        </p>
                      )}

                      {invitation.client_name && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Client Name:</span>{" "}
                          {invitation.client_name}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        Created:{" "}
                        {new Date(invitation.created_at).toLocaleDateString()}
                      </p>

                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        Expires:{" "}
                        {new Date(invitation.expires_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-4">
                      {!isExpired && (
                        <Button
                          onClick={() => handleAcceptInvitation(invitation.id)}
                          isLoading={acceptingId === invitation.id}
                          className="px-4 py-2 bg-primary hover:bg-hover-primary text-white text-sm whitespace-nowrap"
                        >
                          Accept
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientInvitations;
