import React from "react";
import CreateProjectForm from "../../components/agency/create-project-form";

const CreateProject = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <CreateProjectForm />
      </div>
    </div>
  );
};

export default CreateProject;
