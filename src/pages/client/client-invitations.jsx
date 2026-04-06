import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, CheckCircle2, Mail, Calendar } from "lucide-react";
import Button from "../../components/common/button";
import { toast } from "react-toastify";

const ClientInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    fetchPendingInvitations();
  }, []);

  const fetchPendingInvitations = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/agency/client-invitations/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setInvitations(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast.error("Failed to load invitations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      setAcceptingId(invitationId);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/agency/client-invitations/accept`,
        { invitation_id: invitationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Invitation accepted successfully!");
        // Remove accepted invitation from list
        setInvitations(invitations.filter((inv) => inv.invitation_id !== invitationId));
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error(
        error.response?.data?.message || "Failed to accept invitation. Please try again."
      );
    } finally {
      setAcceptingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-gray-600 text-sm">Loading invitations...</p>
      </div>
    );
  }

  return (
    <div className="my-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invitations</h1>
        <p className="text-gray-600">
          Manage your project invitations from agencies
        </p>
      </div>

      {invitations.length === 0 ? (
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
          {invitations.map((invitation) => (
            <div
              key={invitation.invitation_id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {invitation.agency_name || "Project Invitation"}
                    </h3>
                    {invitation.is_accepted && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        <CheckCircle2 size={14} />
                        Accepted
                      </span>
                    )}
                    {invitation.is_expired && (
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
                    {invitation.invitation_message && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Message:</span>{" "}
                        {invitation.invitation_message}
                      </p>
                    )}
                    {invitation.sent_at && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        Sent on {new Date(invitation.sent_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {!invitation.is_accepted && !invitation.is_expired && (
                    <Button
                      onClick={() =>
                        handleAcceptInvitation(invitation.invitation_id)
                      }
                      isLoading={acceptingId === invitation.invitation_id}
                      className="px-4 py-2 bg-primary hover:bg-hover-primary text-white text-sm whitespace-nowrap"
                    >
                      Accept
                    </Button>
                  )}
                  {invitation.is_expired && (
                    <p className="text-xs text-gray-500 text-center">
                      This invitation has expired
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientInvitations;
