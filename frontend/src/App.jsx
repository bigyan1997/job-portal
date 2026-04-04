import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import JobDetail from "./pages/JobDetail";
import Apply from "./pages/Apply";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployerJobDetail from "./pages/EmployerJobDetail";
import PostJob from "./pages/PostJob";
import EditJob from "./pages/EditJob";
import Messages from "./pages/Messages";
import NotFound from "./pages/404";

import Subscription from "./pages/Subscription";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* public routes — anyone can see */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* jobseeker only routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["jobseeker"]}>
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute allowedRoles={["jobseeker"]}>
              <Apply />
            </ProtectedRoute>
          }
        />

        {/* employer only routes */}
        <Route
          path="/employer"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/post"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EditJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/:id"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerJobDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute allowedRoles={["jobseeker"]}>
              <Subscription />
            </ProtectedRoute>
          }
        />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/subscription/cancel" element={<SubscriptionCancel />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
