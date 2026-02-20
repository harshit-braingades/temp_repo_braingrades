import React, { useState } from "react";
import StudentValidator from "../common/StudentValidator";
import { useAuth } from "../../context/AuthContext";

const StudentResultForm = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [formData, setFormData] = useState({
    enrollmentId: "",
    studentId: "",
    courseId: "",
    examType: "",
    marksDetails: [],
  });

  const { user } = useAuth();
  const instituteId = user?.instituteId;

  const examidOptions = [
    "FORMATIVE_I",
    "FORMATIVE_II",
    "SUMMATIVE_I",
    "FORMATIVE_III",
    "FORMATIVE_IV",
    "SUMMATIVE_II",
    "UNIT-TEST",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("marks_")) {
      const subjectName = name.replace("marks_", "");
      const subjectObj = studentData?.payload?.listSubjects?.find(
        (s) => s.subjectName === subjectName
      );

      const subjectId = subjectObj?.subjectId || null;
      const numValue = value === "" ? "" : Number(value);

      if (numValue !== "" && (numValue < 0 || numValue > 100)) return;

      setFormData((prev) => {
        const updatedMarksDetails = (prev.marksDetails || []).filter(
          (m) => m.subjectId !== subjectId
        );

        if (numValue !== "" && subjectId) {
          updatedMarksDetails.push({
            subjectId: subjectId,
            subjectName: subjectName,
            subjectMarks: numValue,
          });
        }

        return {
          ...prev,
          [name]: numValue,
          marksDetails: updatedMarksDetails,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMarksSubmit = async () => {
    const subjects = studentData?.payload?.listSubjects || [];

    const allFilled = subjects.every((subject) =>
      formData.marksDetails.some(
        (m) =>
          m.subjectId === subject.subjectId &&
          m.subjectMarks !== "" &&
          m.subjectMarks !== null &&
          m.subjectMarks >= 0 &&
          m.subjectMarks <= 100
      )
    );

    if (!allFilled) {
      alert("Please fill valid marks (0-100) for all subjects.");
      return;
    }

    if (formData.examType === "") {
      alert("Please select an Exam Type.");
      return;
    }

    const payload = {
      uuid: studentData.payload.uuid,
      enrollmentId: studentData.payload.enrollmentId,
      studentId: studentData.payload.studentId,
      courseId: studentData.payload.courseId,
      instituteId: instituteId,
      examType: formData.examType,
      currentClass: studentData.payload.currentClass,
      marksDetails: formData.marksDetails,
    };

    setLoading(true);

    try {
      const response = await fetch("/v1/dashboard/result-feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed with status ${response.status}`
        );
      }

      await response.json();
      setMessage("Result Successfully added");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error.message.includes("Failed to fetch")
          ? "Network error: Unable to reach server."
          : error.message
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">

      <h2 className="text-lg text-gray-800 ">
        Result Feed Data 
      </h2>

      <StudentValidator
        isSubjectData={true}
        onStudentValidated={(data) => setStudentData(data)}
      />

      {studentData && (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-2">
          <p><strong>Student ID:</strong> {studentData.payload.studentId}</p>
          <p><strong>Enrollment ID:</strong> {studentData.payload.enrollmentId}</p>
          <p><strong>Institute ID:</strong> {studentData.payload.instituteId}</p>
          <p><strong>Name:</strong> {studentData.payload.studentName}</p>
          <p><strong>Class:</strong> {studentData.payload.currentClass}</p>
          <p><strong>Course ID:</strong> {studentData.payload.courseId}</p>
        </div>
      )}

      {studentData && (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-6">

          {studentData?.payload?.listSubjects?.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm">
              <strong>Note:</strong> Input the Marks Awarded for Opted Subjects.
            </div>
          )}

          {studentData?.payload?.listSubjects?.map((subject, index) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <label className="font-semibold text-gray-700">
                {subject.subjectName}
              </label>
              <input
                type="number"
                name={`marks_${subject.subjectName}`}
                min={0}
                max={100}
                value={formData[`marks_${subject.subjectName}`] || ""}
                onChange={handleChange}
                className="w-40 px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div>
            <label className="block font-semibold mb-2">
              Exam Type
            </label>
            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select --</option>
              {examidOptions.map((exam, index) => (
                <option key={index} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center">
            <button
              onClick={handleMarksSubmit}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-3 rounded-full font-semibold transition"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {message && (
            <div
              className={`text-center font-semibold ${
                messageType === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentResultForm;
