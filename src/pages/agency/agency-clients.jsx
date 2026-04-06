import React, { useState, useEffect, useMemo } from "react";
import { UserPlus, SendHorizontal, SquarePen } from "lucide-react";
import { toast } from "react-toastify";
import Pagination from "../../components/agency/pagination";
import Table from "../../components/common/table";
import ClientCard from "../../components/common/client-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteClientSchema } from "../../schema/agency-scema.js";
import InputField from "../../components/common/input-field.jsx";
import Button from "../../components/common/button.jsx";
import FormModal from "../../components/common/popup-modal.jsx";
import {
  getClientInvitations,
  inviteClient,
  updateClient,
  resendClientInvitation,
  deleteClientInvitation,
} from "../../services/agency-services.js";

const ITEMS_PER_PAGE = 3;

const AgencyClients = () => {
  const [allInvitations, setAllInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editClient, setEditClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(inviteClientSchema),
  });

  // Fetch client invitations on component mount
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
        const data = await getClientInvitations();
        setAllInvitations(data);
      } catch (error) {
        console.error("Error fetching invitations:", error);
        toast.error("Failed to load client invitations");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  // Separate pending/expired invitations from accepted clients
  const pendingInvitations = useMemo(
    () =>
      allInvitations.filter(
        (inv) => inv.status === "PENDING" || inv.status === "EXPIRED",
      ),
    [allInvitations],
  );

  const acceptedClients = useMemo(
    () =>
      allInvitations.filter(
        (inv) =>
          inv.isAccepted ||
          (inv.status !== "PENDING" && inv.status !== "EXPIRED"),
      ),
    [allInvitations],
  );

  const totalPages = Math.ceil(pendingInvitations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = pendingInvitations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Handle inviting new client from main form
  const onSubmit = async (formData) => {
    try {
      await inviteClient(formData);
      const updatedInvitations = await getClientInvitations();
      setAllInvitations(updatedInvitations);
      toast.success("Invitation sent successfully");
      reset();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to send invitation",
      );
    }
  };

  // Handle edit - open modal for updating client
  // const handleEdit = (item) => {
  //   setEditClient(item);
  //   setSelectedClient({
  //     name: item.clientName,
  //     email: item.email,
  //   });
  //   setIsModalOpen(true);
  // };

  const handleUpdate = async (data) => {
    try {
      await updateClient(editClient.id, data);
      const updatedInvitations = await getClientInvitations();
      setAllInvitations(updatedInvitations);
      toast.success("Update invitation successfully");
      setSelectedClient(null);
      setEditClient(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error(error?.response?.data?.message || "Failed to update client");
    }
  };

  const columns = [
    { key: "clientName", label: "Client Name" },
    { key: "email", label: "Client Email" },
    { key: "date", label: "Date Sent" },
    { key: "status", label: "Status" },
  ];

  // const handleDelete = async (item) => {
  //   try {
  //     await deleteClientInvitation(item.id);
  //     const updatedInvitations = await getClientInvitations();
  //     setAllInvitations(updatedInvitations);
  //     toast.success("Client invitation deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting invitation:", error);
  //     toast.error(
  //       error?.response?.data?.message || "Failed to delete invitation",
  //     );
  //   }
  // };

  const handleResendInvitation = async (item) => {
    try {
      if (item.status !== "PENDING") {
        await resendClientInvitation(item.id);
        toast.success("Invitation resent successfully");
      } else {
        toast.error("Only expired invitations can be resent");
      }
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast.error(
        error?.response?.data?.message || "Failed to resend invitation",
      );
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      await deleteClientInvitation(clientId);
      const updatedInvitations = await getClientInvitations();
      setAllInvitations(updatedInvitations);
      toast.success("Client deleted successfully");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error(error?.response?.data?.message || "Failed to delete client");
    }
  };

  return (
    <>
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
          setEditClient(null);
        }}
        title={
          <div className="flex gap-3 items-center mb-3">
            <SquarePen
              size={40}
              className="text-primary p-2 bg-indigo-100 rounded-full"
            />
            <span>Edit Client</span>
          </div>
        }
        submitText="Update Client"
        defaultValues={selectedClient}
        onSubmit={handleUpdate}
        schema={inviteClientSchema} // 👈 HERE
        fields={[
          {
            name: "name",
            label: "Client Name",
            placeholder: "Enter client name",
          },
          {
            name: "email",
            label: "Email Address",
            placeholder: "Enter email address",
            type: "email",
          },
        ]}
      />
      <div className="p-4 md:p-6 min-h-screen w-full max-w-full overflow-x-hidden">
        <h2 className="text-heading">Client Invitations & Directory</h2>

        <div className="mt-5 bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <UserPlus
              size={40}
              className="text-white bg-primary rounded-full p-2"
            />
            <h2 className="text-subheading font-semibold text-gray-800">
              Invite New Client
            </h2>
          </div>

          <p className="mt-2 text-xs md:text-sm text-gray-400">
            Send a secure link to your client to grant them access.
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 flex flex-col md:flex-row gap-3 md:items-end"
          >
            {/* Name */}
            <div className="w-full">
              <InputField
                id="name"
                label="Name"
                placeholder="Client Name"
                {...register("name")}
                error={errors.name}
              />
            </div>

            {/* Email */}
            <div className="w-full">
              <InputField
                id="email"
                label="Email"
                placeholder="Email Address"
                {...register("email")}
                error={errors.email}
              />
            </div>

            {/* Button */}
            <div className="w-full mb-1">
              <Button
                type="submit"
                className="w-full md:w-auto bg-primary text-white px-4 py-2 cursor-pointer hover:bg-hover-primary shadow-md shadow-indigo-200"
              >
                <SendHorizontal size={18} className="mr-3" />
                Send Invite
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-5">
          <h2 className="mb-3 text-subheading font-semibold text-gray-800">
            Pending Invitations
          </h2>

          {loading ? (
            <div className="bg-white rounded-xl p-8 shadow-sm flex items-center justify-center">
              <p className="text-gray-500">Loading client invitations...</p>
            </div>
          ) : pendingInvitations.length > 0 ? (
            <>
              <div className="w-full max-w-full">
                <div className="w-full overflow-x-auto">
                  <div className="min-w-max">
                    <Table
                      data={currentData}
                      columns={columns}
                      // onEdit={handleEdit}
                      // onDelete={handleDelete}
                      onSend={handleResendInvitation}
                      renderActions={true}
                    />
                  </div>
                </div>
              </div>

              {/* Pagination */}
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
              <p className="text-gray-500">No pending invitations</p>
            </div>
          )}
        </div>

        <div className="mt-5">
          <h2 className="mb-3 text-subheading font-semibold text-gray-800">
            Accepted Clients
          </h2>

          {acceptedClients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {acceptedClients.map((client, index) => (
                <ClientCard
                  key={client.id || index}
                  companyName={client.clientName || "-"}
                  pointOfContact={"-"}
                  email={client.email}
                  phone={"-"}
                  activeProjects={0}
                  status="Active"
                  initials={
                    client.clientName
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase() || "CC"
                  }
                  onDelete={() => handleDeleteClient(client.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-sm flex items-center justify-center">
              <p className="text-gray-500">No accepted clients yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AgencyClients;
