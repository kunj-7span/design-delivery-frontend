import AgencyDashboard from "./pages/agency/agency-dashboard";
import CreateProject from "./pages/agency/create-project";
import LandingPage from "./pages/landing-page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import ForgotPasswordPage from "./pages/auth/forgot-password-page";
import ResetPasswordPage from "./pages/auth/reset-password-page";
import RegisterPage from "./pages/auth/register-page";
import VerifyOtpPage from "./pages/auth/verify-otp-page";
import AgencyLayout from "./layouts/agency-layout";
import LoginPage from "./pages/auth/login-page";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import AgencyClients from "./pages/agency/agency-clients";
import AgencyEmployees from "./pages/agency/agency-employees";
import AgencySettings from "./pages/agency/agency-settings";
import DesignerDashboard from "./pages/designer/designer-dashboard";
import DesignerProjects from "./pages/designer/designer-projects";
import MainApp from "./pages/agency/agency-projects-list";
import ClientLayout from "./layouts/client-layout";
import ClientDashboard from "./pages/client/client-dashbord";
import ClientInvitations from "./pages/client/client-invitations";
import AgencyProjectsList from "./pages/agency/agency-projects-list";
import ErrorPage from "./pages/error-page";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" errorElement={<ErrorPage />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="designer" element={<DesignerDashboard />} />
        <Route path="designer/projects" element={<DesignerProjects />} />
        <Route path="/projects" element={<MainApp />} />

        <Route path="verify-otp" element={<VerifyOtpPage />} />
        {/* <Route path='reset-password' element={<ResetPassword />} /> */}

        {/* public routes */}
        {/* <Route element={<CommonLayout />}>
        </Route> */}

        {/* agency routes */}
        <Route
          element={
            <RoleProtectedRoute allowedRoles={["agency", "superadmin"]} />
          }
        >
          <Route path="agency" element={<AgencyLayout />}>
            <Route path="agency-dashboard" element={<AgencyDashboard />} />
            <Route path="create-project" element={<CreateProject />} />
            <Route path="agency-projects" element={<AgencyProjectsList />}>
              {/* <Route path='view-project/:project-id' element={<ViewProject />} /> */}
            </Route>
            <Route path="agency-clients" element={<AgencyClients />} />
            <Route path="agency-employees" element={<AgencyEmployees />} />
            <Route path="agency-settings" element={<AgencySettings />} />
          </Route>
        </Route>

        {/* client routes */}
        <Route
          element={
            <RoleProtectedRoute allowedRoles={["client", "superadmin"]} />
          }
        >
          <Route path="client-dashboard" element={<ClientLayout />}>
            <Route index element={<ClientDashboard />} />
            <Route path="invitations" element={<ClientInvitations />} />
            {/* <Route path='client-projects' element={<ClientProjects />}>
              <Route path='create-project' element={<CreateProject />} />
              <Route path='view-project/:project-id' element={<ViewProject />} />
            </Route>
            <Route path="client-clients" element={<ClientClients />} />
            <Route path="client-employees" element={<ClientEmployees />} />
            <Route path="client-settings" element={<ClientSettings />} /> */}
          </Route>
        </Route>

        {/* designer routes */}
        <Route
          element={
            <RoleProtectedRoute allowedRoles={["designer", "superadmin"]} />
          }
        >
          <Route path="employee-dashboard" element={<DesignerDashboard />} />
          {/* <Route index element={<DesignerDashboard />} />
            <Route path="designer-projects" element={<DesignerProjects />}>
              <Route
                path="view-project/:project-id"
                element={<ViewDesignerProject />}
              />
              <Route
                path="view-project/:project-id/requirement/:requirement-id"
                element={<ViewAssets />}
              />
              <Route
                path="view-project/:project-id/requirement/:requirement-id/asset-collaboration"
                element={<ViewAssetsCollaboration />}
              />
            </Route>
            <Route path="designer-settings" element={<DesignerSettings />} />
            <Route
              path="designer-notification"
              element={<DesignerNotification />}
            />
          </Route> */}
        </Route>

        {/* end-client routes */}
        {/* <Route element={<RoleProtectedRoute allowedRoles={['end-client', 'superadmin']} />}>
          <Route path='end-client-dashboard' element={<EndClientLayout />}>
            <Route index element={<EndClientDashboard />} />
            <Route path='end-client-projects' element={<EndClientProjects />}>
              <Route path='view-project/:project-id' element={<ViewEndCLientProject />} />
              <Route path='view-project/:project-id/requirement/:requirement-id' element={<ViewEndCLientAssets />} />
              <Route path='view-project/:project-id/requirement/:requirement-id/asset-collaboration' element={<ViewAssetsCollaboration />} />
            </Route>
            <Route path="end-client-settings" element={<EndClientSettings />} />
            <Route path="end-client-notification" element={<EndClientNotification />} />
            <Route path="calender" element={<CalenderView />} />
          </Route>
        </Route> */}

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<ErrorPage />} />
      </Route>,
    ),
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        theme="colored"
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <RouterProvider router={router} />
    </>
    // <LandingPage/>
    // <Login/>
    // <LoginPage />
    // <ResetPasswordPage />
  );
}

export default App;
