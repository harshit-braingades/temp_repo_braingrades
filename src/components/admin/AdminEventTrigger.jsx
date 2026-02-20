import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const classes = [
  "CLASS_1","CLASS_2","CLASS_3","CLASS_4","CLASS_5","CLASS_6",
  "CLASS_7","CLASS_8","CLASS_9","CLASS_10","CLASS_11","CLASS_12"
];

const courses = ["SC_M_001", "SC_B_002", "COM_004", "ART_003"];
const emailTypes = ["STD_WELCOME", "STD_SUMMATIVE", "STD_FORMATIVE", "STD_ATTENDANCE"];

export default function AdminEventTrigger() {
  const { user } = useAuth();
  const instituteId = user?.instituteId;

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedEmailType, setSelectedEmailType] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("");
  const [eligibleUser, setEligibleUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const getPhaseOptions = (emailType) => {
    if (emailType === "STD_WELCOME") return [1];
    if (emailType === "STD_SUMMATIVE") return [1, 2];
    if (emailType === "STD_FORMATIVE") return [1, 2, 3, 4];
    if (emailType === "STD_ATTENDANCE") return Array.from({ length: 12 }, (_, i) => i + 1);
    return [];
  };

  const handleNotificationFetchUser = async () => {
    if (!selectedPhase) {
      setMessage("Please select Phase");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        "/v1/dashboard/fetched-user-notification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            selectedClass,
            selectedCourse,
            selectedEmailType,
            instituteId,
            phase: selectedPhase,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch users");

      const result = await response.json();

      if (result.payload?.length > 0) {
        setEligibleUser(result.payload);
        setMessage("Users fetched successfully");
        setMessageType("success");
      } else {
        setEligibleUser([]);
        setMessage("No eligible users found");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Network or server error");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (index) => {
    setLoading(index);

    const userData = {
      ...eligibleUser[index],
      phase: selectedPhase,
      instituteId,
    };

    try {
      const response = await fetch(
        "/v1/dashboard/trigger-user-notification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) throw new Error("Email failed");

      setEligibleUser((prev) => {
        const updated = [...prev];
        updated[index].emailSent = true;
        return updated;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <select onChange={(e) => setSelectedClass(e.target.value)} className="border rounded-lg p-2">
          <option value="">Select Class</option>
          {classes.map((cls) => <option key={cls}>{cls}</option>)}
        </select>

        <select onChange={(e) => setSelectedCourse(e.target.value)} className="border rounded-lg p-2">
          <option value="">Select Course</option>
          {courses.map((course) => <option key={course}>{course}</option>)}
        </select>

        <select
          value={selectedEmailType}
          onChange={(e) => {
            setSelectedEmailType(e.target.value);
            setSelectedPhase("");
          }}
          className="border rounded-lg p-2"
        >
          <option value="">Select Email Type</option>
          {emailTypes.map((email) => <option key={email}>{email}</option>)}
        </select>

        <select
          value={selectedPhase}
          onChange={(e) => setSelectedPhase(Number(e.target.value))}
          disabled={!selectedEmailType}
          className="border rounded-lg p-2"
        >
          <option value="">Select Phase</option>
          {getPhaseOptions(selectedEmailType).map((phase) => (
            <option key={phase} value={phase}>Phase {phase}</option>
          ))}
        </select>

        <button
          onClick={handleNotificationFetchUser}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
        >
          Load Users
        </button>
      </div>

      {message && (
        <div className={`mb-4 text-sm font-medium ${
          messageType === "success" ? "text-green-600" : "text-red-600"
        }`}>
          {message}
        </div>
      )}

      {/* Table */}
      {eligibleUser.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Student ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {eligibleUser.map((user, index) => (
                <tr key={index} className="text-center">
                  <td className="p-2 border">{user.studentId}</td>
                  <td className="p-2 border">{user.studentName}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">
                    {user.emailSent ? (
                      <span className="text-green-600 font-medium">Sent</span>
                    ) : (
                      <button
                        onClick={() => sendEmail(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center justify-center gap-1"
                      >
                        {loading === index ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          "Send"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
