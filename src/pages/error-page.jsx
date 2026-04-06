import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/button";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
      <div className="my-container flex flex-col items-center justify-center text-center py-20">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
            <AlertCircle size={40} className="text-red-500" />
          </div>
        </div>

        {/* Error Code */}
        {/* <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-4">
          404
        </h1> */}

        {/* Error Title */}
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3">
          Page Comming Soon!
        </h2>

        {/* Error Description */}
        {/* <p className="text-gray-500 leading-relaxed text-sm md:text-base max-w-md mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p> */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 bg-white hover:border-primary hover:bg-purple-50 text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </Button>
{/* 
          <Button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-hover-primary text-white transition-colors"
          >
            <Home size={16} />
            <span>Go to Home</span>
          </Button> */}
        </div>

        {/* Decorative Elements */}
        <div className="mt-16">
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
