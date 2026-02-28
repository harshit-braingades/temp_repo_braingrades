import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const AttendanceMonth = () => {
  const { user } = useAuth();
  const instituteId = user?.instituteId;
  const [selectClass, setSelectClass] = useState("");
  const [selectSection, setSelectSection] = useState("");
  const [selectMonth, setSelectMonth] = useState("");
  const [selectYear, setSelectYear] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const classes = Array.from({ length: 12 }, (_, i) => `CLASS_${i + 1}`);
  const sections = ["A", "B", "C"];
  const yearsList = Array.from({ length: 12 }, (_, i) => `${2024 + i}`);

  const monthDays = {
    JANUARY: 31,
    FEBRUARY: 28,
    MARCH: 31,
    APRIL: 30,
    MAY: 31,
    JUNE: 30,
    JULY: 31,
    AUGUST: 31,
    SEPTEMBER: 30,
    OCTOBER: 31,
    NOVEMBER: 30,
    DECEMBER: 31,
  };

  // Fetch Students
  const fetchStudentForAttendance = async () => {
    if (!selectClass || !selectSection || !selectMonth || !selectYear) {
      setMessage("Please select class, section, month and year.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `/v1/dashboard/attendance/students/${instituteId}/${selectClass}/${selectSection}?calendarMonth=${selectMonth}&calendarYear=${selectYear}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();

      if (!data.payload?.length) {
        setStudentList([]);
        setMessage("No students found.");
        setMessageType("error");
      } else {
        setStudentList(data.payload);
      }
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Initialize Attendance Grid
  useEffect(() => {
    if (!studentList.length || !selectMonth || !selectYear) return;

    let daysInMonth = monthDays[selectMonth];
    const year = parseInt(selectYear);

    if (
      selectMonth === "FEBRUARY" &&
      year % 4 === 0 &&
      (year % 100 !== 0 || year % 400 === 0)
    ) {
      daysInMonth = 29;
    }

    const newAttendance = {};

    studentList.forEach((student) => {
      const days =
        student.monthAttendance && typeof student.monthAttendance === "object"
          ? student.monthAttendance
          : Object.fromEntries(
              Array.from({ length: daysInMonth }, (_, i) => [i + 1, true]),
            );

      newAttendance[student.studentId] = {
        days,
        presentCount: Object.values(days).filter(Boolean).length,
      };
    });

    setAttendance(newAttendance);
  }, [studentList]);

  const toggleAttendance = (studentId, day) => {
    setAttendance((prev) => {
      const updated = { ...prev };
      const current = updated[studentId].days[day];
      updated[studentId].days[day] = !current;
      updated[studentId].presentCount += current ? -1 : 1;
      return { ...updated };
    });
  };

  const saveAttendance = async (uuid, studentId, courseId, enrollmentId) => {
    const payload = {
      uuid,
      studentId,
      courseId,
      enrollmentId,
      instituteId,
      className: selectClass,
      section: selectSection,
      month: selectMonth,
      year: selectYear,
      monthAttendance: attendance[studentId]?.days,
    };

    try {
      setLoading(true);
      const response = await fetch("v1/dashboard/attendance/save-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save attendance");

      setMessage("Attendance saved successfully.");
      setMessageType("success");
    } catch (err) {
      setMessage("Failed to save attendance.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 space-y-1 border-2 ">
      {/* <h2 className="text-md mb-2">Month Wise</h2> */}
      <div>
        <div className="grid md:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow border ">
          <select
            className="border p-2 rounded"
            onChange={(e) => setSelectClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls}>{cls}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            onChange={(e) => setSelectSection(e.target.value)}
          >
            <option value="">Select Section</option>
            {sections.map((sec) => (
              <option key={sec}>{sec}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            onChange={(e) => setSelectMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            {Object.keys(monthDays).map((month) => (
              <option key={month}>{month}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            onChange={(e) => setSelectYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {yearsList.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>

          <button
            onClick={fetchStudentForAttendance}
            className="md:col-span-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Load Users Data
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {studentList.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Student Name</th>
                  <th className="p-3">ID</th>
                  <th className="p-3">Calendar</th>
                  <th className="p-3">Present/Total</th>
                  <th className="p-3">Save</th>
                </tr>
              </thead>

              <tbody>
                {studentList.map((student) => {
                  const studentAtt = attendance[student.studentId];
                  const totalDays = studentAtt
                    ? Object.keys(studentAtt.days).length
                    : 0;

                  return (
                    <tr key={student.studentId} className="border-t">
                      <td className="p-3">{student.studentName}</td>
                      <td className="p-3 text-center">{student.studentId}</td>

                      <td className="p-3">
                        <div className="grid grid-cols-7 gap-1">
                          {studentAtt &&
                            Object.entries(studentAtt.days).map(
                              ([day, isPresent]) => (
                                <div
                                  key={day}
                                  onClick={() =>
                                    toggleAttendance(
                                      student.studentId,
                                      parseInt(day),
                                    )
                                  }
                                  className={`w-7 h-7 text-xs flex items-center justify-center rounded cursor-pointer ${
                                    isPresent
                                      ? "bg-green-200 text-green-800"
                                      : "bg-red-200 text-red-800"
                                  }`}
                                >
                                  {day}
                                </div>
                              ),
                            )}
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        {studentAtt?.presentCount || 0}/{totalDays}
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() =>
                            saveAttendance(
                              student.uuid,
                              student.studentId,
                              student.courseId,
                              student.enrollmentId,
                            )
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceMonth;
