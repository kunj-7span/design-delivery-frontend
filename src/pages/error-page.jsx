import { AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/button";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-white via-purple-50/40 to-white flex items-center justify-center px-4 py-14">
      <div className="pointer-events-none absolute -top-20 -left-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="my-container text-center">

        <div className="-mt-6 mb-5 flex justify-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/80 border border-primary/20 shadow-md shadow-primary/10 backdrop-blur">
            <AlertCircle size={28} className="text-primary" />
          </div>
        </div>

        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3">
          Page not found
        </h2>
        <p className="text-gray-500 leading-relaxed max-w-xl mx-auto mb-8">
          The page you are trying to open does not exist or may have been moved.
        </p>

        <div className="flex justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-hover-primary text-white shadow-lg shadow-primary/20"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </Button>
        </div>

        <div className="mt-8">
          <div className="inline-flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary/30 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-primary/70 animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
