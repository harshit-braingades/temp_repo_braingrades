import React, { useState } from "react";
import AdminEventTrigger from "../admin/AdminEventTrigger";
import AdminFunctionality from "../admin/AdminFunctionality";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("trigger");

  return (
    <div className="w-full px-2 ">
      {/* Header */}
      <h1 className="text-lg mb-1 ">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("trigger")}
          className={`px-5 py-2 rounded-lg transition ${
            activeTab === "trigger"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Trigger Emails
        </button>

        <button
          onClick={() => setActiveTab("admin")}
          className={`px-5 py-2 rounded-lg transition ${
            activeTab === "admin"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Admin Functionality
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "trigger" ? (
          <AdminEventTrigger />
        ) : (
          <AdminFunctionality />
        )}
      </div>
    </div>
  );
}
