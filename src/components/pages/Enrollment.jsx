import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Enrollment = () => {
  const { user } = useAuth();
  const instituteId = user?.instituteId || "";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    enrollmentId: "",
    studentId: "",
    instituteId: instituteId,
    courseId: "",
    currentClass: "",
    section: "",
    enrollmentStatus: "ACTIVE",
    enrollmentDate: "",
    studentName: "",
    dateOfBirth: "",
    studentEmail: "",
    parentEmail: "",
    gender: "",
    mailingAddress: "",
    fatherName: "",
    motherName: "",
    // sessionStart: "",
    // sessionEnd: "",
  });

  const classes = [
    "CLASS_1","CLASS_2","CLASS_3","CLASS_4","CLASS_5",
    "CLASS_6","CLASS_7","CLASS_8","CLASS_9",
    "CLASS_10","CLASS_11","CLASS_12",
  ];

  const courses = ["SC_M_001", "SC_B_002", "COM_004", "ART_003"];
  const sections = ["A", "B", "C"];
  const statuses = ["ACTIVE", "COMPLETED", "DROPPED"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitEnrollment = async () => {
    setMessage("");
    setMessageType("");

    const isFormValid = Object.values(formData).every(
      (val) => val && val.toString().trim() !== ""
    );

    if (!isFormValid) {
      setMessage("Please fill all required fields.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/v1/dashboard/enroll-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Enrollment failed");
      }

      await response.json();

      setMessage("Enrollment Successful!");
      setMessageType("success");

    } catch (error) {
      setMessage(error.message || "Something went wrong.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">

      <h2 className="text-lg mb-3">
        Student Enrollment
      </h2>

      <div className="bg-white shadow-md rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Institute ID */}
        <Input label="Institute ID" name="instituteId" value={formData.instituteId} onChange={handleChange} />

        <Input label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} />

        <Input label="Student Name" name="studentName" value={formData.studentName} onChange={handleChange} />

        <Input label="Father Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />

        <Input label="Mother Name" name="motherName" value={formData.motherName} onChange={handleChange} />

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <div className="flex gap-6">
            <Radio name="gender" value="MALE" checked={formData.gender === "MALE"} onChange={handleChange} label="Male" />
            <Radio name="gender" value="FEMALE" checked={formData.gender === "FEMALE"} onChange={handleChange} label="Female" />
          </div>
        </div>

        <Input type="date" label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />

        <Input type="email" label="Student Email" name="studentEmail" value={formData.studentEmail} onChange={handleChange} />

        <Input type="email" label="Parent Email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} />

        <Input label="Enrollment ID" name="enrollmentId" value={formData.enrollmentId} onChange={handleChange} />

        {/* <Input label="Session Start" name="sessionStart" value={formData.sessionStart} onChange={handleChange} />
        
        <Input label="Session End" name="sessionEnd" value={formData.sessionEnd} onChange={handleChange} /> */}

        <Select label="Enrollment Status" name="enrollmentStatus" value={formData.enrollmentStatus} options={statuses} onChange={handleChange} />

        <Input type="date" label="Enrollment Date" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} />

        <Select label="Course ID" name="courseId" value={formData.courseId} options={courses} onChange={handleChange} />

        <Select label="Class" name="currentClass" value={formData.currentClass} options={classes} onChange={handleChange} />

        <Select label="Section" name="section" value={formData.section} options={sections} onChange={handleChange} />

        {/* Mailing Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Mailing Address</label>
          <textarea
            name="mailingAddress"
            value={formData.mailingAddress}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

      </div>

      {/* Submit */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={submitEnrollment}
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded-md hover:opacity-90 transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {message && (
        <div
          className={`mt-4 text-sm ${
            messageType === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}

    </div>
  );
};

export default Enrollment;

/* ------------------ Reusable Components ------------------ */

const Input = ({ label, type = "text", name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
    />
  </div>
);

const Select = ({ label, name, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
    >
      <option value="">-- Select --</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const Radio = ({ name, value, checked, onChange, label }) => (
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    {label}
  </label>
);
