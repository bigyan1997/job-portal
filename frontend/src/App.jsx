import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageTransition from "./components/PageTransition";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import CheckEmail from "./pages/CheckEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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
import ForEmployers from "./pages/ForEmployers";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />
        <Route
          path="/verify-email/:token"
          element={
            <PageTransition>
              <VerifyEmail />
            </PageTransition>
          }
        />
        <Route
          path="/check-email"
          element={
            <PageTransition>
              <CheckEmail />
            </PageTransition>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PageTransition>
              <ForgotPassword />
            </PageTransition>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PageTransition>
              <ResetPassword />
            </PageTransition>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <PageTransition>
              <JobDetail />
            </PageTransition>
          }
        />
        <Route
          path="/for-employers"
          element={
            <PageTransition>
              <ForEmployers />
            </PageTransition>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["jobseeker"]}>
              <PageTransition>
                <JobSeekerDashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute allowedRoles={["jobseeker"]}>
              <PageTransition>
                <Apply />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <PageTransition>
                <EmployerDashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/post"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <PageTransition>
                <PostJob />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <PageTransition>
                <EditJob />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/:id"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <PageTransition>
                <EmployerJobDetail />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Messages />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute allowedRoles={["jobseeker"]}>
              <PageTransition>
                <Subscription />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription/success"
          element={
            <PageTransition>
              <SubscriptionSuccess />
            </PageTransition>
          }
        />
        <Route
          path="/subscription/cancel"
          element={
            <PageTransition>
              <SubscriptionCancel />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
