import React, { useState } from "react";

const StudentInsights = () => {
  const [studentId, setStudentId] = useState("");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!studentId || !enrollmentId) {
      setError("Please enter both Student ID and Enrollment ID.");
      return;
    }

    const targetDashboardURL = `https://external-dashboard.com/student/${studentId}?enrollment=${enrollmentId}`;

    // temporary redirect
    window.location.href = "https://www.google.com/";
  };

  return (
    <div className="p-6 flex flex-col items-center">

      <h1 className="text-2xl font-bold mb-6">
        Student Insights
      </h1>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">

        <h3 className="text-lg font-semibold text-center mb-6">
          Login to Student Insight Portal
        </h3>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-1">
              Student ID
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Enrollment ID
            </label>
            <input
              type="text"
              value={enrollmentId}
              onChange={(e) => setEnrollmentId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>
      </div>

    </div>
  );
};

export default StudentInsights;
