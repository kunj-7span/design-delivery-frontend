import React, { useState, useMemo, useEffect } from "react";
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

const ITEMS_PER_PAGE = 3;

const AgencyEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(addEmployeeSchema),
  });


  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [employees, searchTerm]);

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredEmployees.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const onSubmit = async (formData) => {
    try {
      if (editEmployee) {
        // Update employee - API call can be added later
        setEmployees(
          employees.map((emp) =>
            emp.id === editEmployee.id ? { ...emp, ...formData } : emp,
          ),
        );
        toast.success("Employee updated successfully");
        setEditEmployee(null);
      } else {
        // Add new employee via API
        const newEmployee = await addEmployee(formData);
        setEmployees([...employees, newEmployee]);
        toast.success("Employee added successfully");
        console.log("employee added")
      }
      reset();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(error?.response?.data?.message || "Failed to add employee");
    }
  };

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleUpdate = (data) => {
    console.log("Updated Employee:", data);
    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id ? { ...emp, ...data } : emp,
      ),
    );
    setSelectedEmployee(null);
    setEditEmployee(null);
  };

  const handleDelete = async (item) => {
    try {
      await deleteEmployee(item.id);
      setEmployees(employees.filter((emp) => emp.id !== item.id));
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

        {/* Add Employee Form Card */}
        <div className="mt-5 bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <UserPlus
              size={40}
              className="text-white bg-primary rounded-full p-2"
            />
            <h2 className="text-subheading font-semibold text-gray-800">
              {editEmployee ? "Edit Employee" : "Add New Employee"}
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
                className="w-full md:w-auto bg-primary text-white px-4 py-2 mb-1 cursor-pointer hover:bg-hover-primary shadow-md shadow-indigo-200"
              >
                <UserPlus size={18} className="mr-3" />
                {editEmployee ? <>Update Employee</> : <>Add Employee</>}
              </Button>
            </div>
          </form>
        </div>

        {/* Employees Table Section */}
        <div className="mt-5 bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-subheading font-semibold text-gray-800">
              Employees{" "}
              <span className="p-2 bg-gray-200 text-xs rounded-xl ml-3">
                {filteredEmployees.length} Total
              </span>
            </h2>

            {/* Search Bar */}
            <div className="w-full md:w-64 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              />
            </div>
          </div>

          <div className="w-full max-w-full">
            <div className="w-full overflow-x-auto">
              <div className="min-w-max">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading employees...
                  </div>
                ) : currentData.length > 0 ? (
                  <EmployeeTable data={currentData} onDelete={handleDelete} />
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
