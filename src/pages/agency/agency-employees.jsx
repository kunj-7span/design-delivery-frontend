import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import Pagination from "../../components/common/pagination";
import EmployeeTable from "../../components/agency/employee-table.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addEmployeeSchema } from "../../schema/agency-schema.js";
import InputField from "../../components/common/input-field.jsx";
import Button from "../../components/common/button.jsx";
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
  const [totalEmp, setTotalEmp] = useState(0)
  const [fetch, setFetch] = useState(false);
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
  }, [currentPage, fetch]);

  const onSubmit = async (formData) => {
    try {
      await addEmployee(formData);
      setCurrentPage(1);
      setFetch(!fetch)
      toast.success("Employee added successfully");
      reset();
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(error?.response?.data?.message || "Failed to add employee");
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
              <span className="px-3 py-1.5 bg-gray-200 text-xs rounded-xl">{totalEmp} Total</span>
            </h2>
          </div>

          <div className="min-h-[360px]">
            <div className="w-full max-w-full h-full">
              <div className="w-full overflow-x-auto h-full">
                <div className="min-w-max h-full">
                  {loading ? (
                    <div className="h-full min-h-[360px] text-center py-8 text-gray-500 flex items-center justify-center">
                      Loading employees...
                    </div>
                  ) : employees.length > 0 ? (
                    <EmployeeTable data={employees} onDelete={handleDelete} />
                  ) : (
                    <div className="h-full min-h-[360px] text-center py-8 text-gray-500 flex items-center justify-center">
                      No employees found
                    </div>
                  )}
                </div>
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
