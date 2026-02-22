import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./components/pages/LoginPage";

/* Existing Pages */
import Home from "./components/pages/Home";
import Enrollment from "./components/pages/Enrollment";
import CourseFeed from "./components/pages/CourseFeed";
import ResultFeed from "./components/pages/ResultFeed";
import Attendance from "./components/pages/Attendance";
import StudentInsights from "./components/pages/StudentInsights";
import Admin from "./components/pages/Admin";

/* Dummy Pages */
const PromoteStudent = () => <div className="p-2">Student Promote Page</div>;
const ExportStudent = () => <div className="p-2">Student Data Export Page</div>;

const AddTeacher = () => <div className="p-2">Add Teacher Page</div>;
const ManageTeacher = () => <div className="p-2">Manage Teachers Page</div>;

const FeesOverview = () => <div className="p-2">Fees Overview Page</div>;
const FeesCollection = () => <div className="p-2">Fees Collection Page</div>;

const AdminSettings = () => <div className="p-2">Admin Settings Page</div>;

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />

        {/* STUDENT */}
        <Route path="/student/enrollment" element={<Enrollment />} />
        <Route path="/student/promote" element={<PromoteStudent />} />
        <Route path="/student/export" element={<ExportStudent />} />
        <Route path="/student/insight" element={<StudentInsights />} />

        {/* EMPLOYEES */}
        <Route path="/employees/add-teacher" element={<AddTeacher />} />
        <Route path="/employees/manage" element={<ManageTeacher />} />

        {/* ACADEMICS */}
        <Route path="/academics/course-feed" element={<CourseFeed />} />
        <Route path="/academics/result-feed" element={<ResultFeed />} />
        <Route path="/academics/attendance" element={<Attendance />} />

        {/* FEES */}
        <Route path="/fees/overview" element={<FeesOverview />} />
        <Route path="/fees/collection" element={<FeesCollection />} />

        {/* ADMIN */}
        <Route path="/admin/trigger" element={<Admin />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default App;
