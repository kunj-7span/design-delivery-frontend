import React, { useState, useEffect } from "react";
import { UserPlus, SquarePen, Search } from "lucide-react";
import { toast } from "react-toastify";
import Pagination from "../../components/agency/pagination";
import EmployeeTable from "../../components/agency/employee-table.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addEmployeeSchema } from "../../schema/agency-scema.js";
import InputField from "../../components/common/input-field.jsx";
import Button from "../../components/common/button.jsx";
import FormModal from "../../components/common/popup-modal.jsx";
import {
  getEmployees,
  addEmployee,
  deleteEmployee,
} from "../../services/agency-services.js";

const ITEMS_PER_PAGE = 5;

const AgencyEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editEmployee, setEditEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [totalEmp, setTotalEmp] = useState(0)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(addEmployeeSchema),
  });

  // Fetch employees on component mount and on page change
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await getEmployees({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
        setEmployees(response.data);
        setTotalPages(response.meta.totalPages);
        setTotalEmp(response.meta.totalEmployees)
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [currentPage]);

  const onSubmit = async (formData) => {
    try {
      if (editEmployee) {
        // Update employee
        await addEmployee(formData);
        // Refetch current page after update
        const response = await getEmployees({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
        setEmployees(response.data);
        setTotalPages(response.meta.totalPages);
        setTotalEmp(response.meta.totalEmployees)
        toast.success("Employee updated successfully");
        setEditEmployee(null);
      } else {
        await addEmployee(formData);
        // Reset to page 1 to see new employee
        setCurrentPage(1);
        toast.success("Employee added successfully");
      }
      reset();
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(error?.response?.data?.message || "Failed to add employee");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await addEmployee(data);
      // Refetch current page after update
      const response = await getEmployees({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setEmployees(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalEmp(response.meta.totalEmployees)
      toast.success("Employee updated successfully");
      setSelectedEmployee(null);
      setEditEmployee(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update employee",
      );
    }
  };

  const handleDelete = async (item) => {
    try {
      await deleteEmployee(item.id);
      // Refetch current page after delete
      const response = await getEmployees({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setEmployees(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalEmp(response.meta.totalEmployees)
      toast.success("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete employee",
      );
    }
  };

  return (
    <>
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
          setEditEmployee(null);
        }}
        title={
          <div className="flex gap-3 items-center mb-3">
            <SquarePen
              size={40}
              className="text-primary p-2 bg-indigo-100 rounded-full"
            />
            <span>Edit Employee</span>
          </div>
        }
        submitText="Update Employee"
        defaultValues={selectedEmployee}
        onSubmit={handleUpdate}
        schema={addEmployeeSchema}
        fields={[
          {
            name: "name",
            label: "Employee Name",
            placeholder: "Enter employee name",
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
        <h2 className="text-heading">Employee Management</h2>

        <div className="mt-5 bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <UserPlus
              size={40}
              className="text-white bg-primary rounded-full p-2"
            />
            <h2 className="text-subheading font-semibold text-gray-800">
              Add New Employee
            </h2>
          </div>

          <p className="mt-2 text-xs md:text-sm text-gray-400">
            Add a new employee to your agency team.
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
                placeholder="Employee Name"
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
            <div className="w-full">
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading}
                className="w-full md:w-auto bg-primary text-white px-4 py-2 mb-2 cursor-pointer hover:bg-hover-primary shadow-md shadow-indigo-200"
              >
                <UserPlus size={18} className="mr-3" />
                Add Employee
              </Button>
            </div>
          </form>
        </div>

        {/* Employees Table Section */}
        <div className="mt-5 bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="flex items-center gap-3 text-subheading font-semibold text-gray-800">
              <span>Employees</span> 
              <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">{totalEmp} Total</span>
            </h2>
          </div>

          <div className="w-full max-w-full">
            <div className="w-full overflow-x-auto">
              <div className="min-w-max">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading employees...
                  </div>
                ) : employees.length > 0 ? (
                  <EmployeeTable data={employees} onDelete={handleDelete} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No employees found
                  </div>
                )}
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
        </div>
      </div>
    </>
  );
};

export default AgencyEmployees;
