import React, { useEffect, useState } from "react";
import MyCalender from "./MyCalender";
import dayjs from "dayjs";

const AttendanceDaily = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [section, setSection] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const Classes = Array.from({ length: 12 }, (_, i) => i + 1);
  const Sections = ["A", "B", "C"];

  const loadAttendance = async () => {
    try {
      if (!selectedClass || !section) {
        setErrorMessage("Please select class and section");
        return;
      }

      setErrorMessage("");
      setAttendance({});
      const day = dayjs(selectedDate).date();
      const month = dayjs(selectedDate).format("MMMM").toUpperCase();
      const year = dayjs(selectedDate).year();

      const payload = {
        currentClass: selectedClass,
        section: section,
        instituteId: "GFH001", // temporary hardcode
        year,
        month,
        day,
      };

      const response = await fetch(
        "http://localhost:8080/v1/dashboard/attendance/load",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (data.success) {
        const list = data.payload.attendanceList;

        setStudents(list);

        const initialAttendance = {};
        list.forEach((student) => {
          initialAttendance[student.studentId] = student.attendanceStatus;
        });

        setAttendance(initialAttendance);
        console.log(students);
        console.log(attendance);
      }
    } catch (error) {
      console.error("Load error:", error);
    }
  };

  useEffect(() => {
    console.log("Students updated:", students);
  }, [students]);

  const saveAttendance = async () => {
    try {
      if (!selectedClass || !section) {
        setErrorMessage("Please select class and section");
        return;
      }

      setErrorMessage("");
      const day = dayjs(selectedDate).date();
      const month = dayjs(selectedDate).format("MMMM").toUpperCase();
      const year = dayjs(selectedDate).year();

      const formattedList = students.map((student) => ({
        uuid: student.uuid,
        studentId: student.studentId,
        courseId: student.courseId,
        enrollmentId: student.enrollmentId,
        currentClass: selectedClass,
        section: section,
        attendanceStatus:
          attendance[student.studentId] !== undefined
            ? attendance[student.studentId]
            : null,
      }));
      console.log(formattedList);

      const payload = {
        currentClass: selectedClass,
        section: section,
        instituteId: "GFH001",
        year,
        month,
        day,
        allStudentattendanceList: formattedList,
      };

      const response = await fetch(
        "http://localhost:8080/v1/dashboard/mark-allstudent-attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert("Attendance saved successfully");
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleAttendance = (id, value) => {
    setAttendance((prev) => {
      if (prev[id] === value) {
        return { ...prev, [id]: null };
      }
      return { ...prev, [id]: value };
    });
  };

  return (
    <div className="border ">
      <div className="grid md:grid-cols-4 gap-4 bg-white p-5 m-2 rounded-xl shadow border ">
        <select
          className="border p-2 rounded"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option>Select Class </option>
          {Classes.map((cls) => (
            <option key={cls} value={`CLASS_${cls}`}>
              Class {cls}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          <option>Select Section </option>
          {Sections.map((sec) => (
            <option value={sec}> {sec}</option>
          ))}
        </select>
        <div className="relative">
          <button
            onClick={() => setIsCalendarOpen((prev) => !prev)}
            className="border-2 bg-white rounded-lg pl-3 pr-14 py-2 border border-blue-300 "
          >
          Select Date
          </button>
          {isCalendarOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white shadow-lg rounded-lg p-2">
              <MyCalender
                selectedDate={selectedDate}
                setSelectedDate={(date) => {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                }}
              />
            </div>
          )}
        </div>

        <button
          onClick={loadAttendance}
          className="md:col-span-4 bg-primary text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Load Users Data
        </button>
        {/* {errorMessage && (
          <div className="md:col-span-4 text-red-500 text-sm text-center mt-2">
            {errorMessage}
          </div>
        )} */}
      </div>
      {students.length > 0 && (
        <div className=" bg-white p-1 mr-3 ml-3 mb-3 rounded-xl shadow border ">
          {/* table */}
          <table className="min-w-full border border-gray-300 border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300  px-4 py-2 bg-primary text-white">
                  Std id
                </th>
                <th className="border border-gray-300  px-4 py-2 bg-primary text-white w-48">
                  Name
                </th>
                <th className="border border-gray-300  px-4 py-2 bg-primary text-white">
                  Section
                </th>
                <th className="border border-gray-300  px-4 py-2 bg-primary text-white w-72">
                  Attendacane Status
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.uuid} className="text-center">
                  <td className="border border-gray-300  p-1">
                    {student.studentId}
                  </td>
                  <td className="border border-gray-300  p-1">
                    {student.studentName}
                  </td>
                  <td className="border border-gray-300  p-1">{section}</td>
                  <td className="border border-gray-300  p-1">
                    {/* <div className="">
                    <button
                      onClick={() => handleAttendance(student.studentId, false)}
                      className={` px-5 m-1 rounded-full py-1 ${attendance[student.studentId] === false ? "bg-red-600 text-white  " : "bg-gray-200"}`}
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => handleAttendance(student.studentId, true)}
                      className={` px-5 m-1 rounded-full py-1 ${attendance[student.studentId] === true ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    >
                      Present
                    </button>
                  </div> */}

                    <div className="inline-flex border border-gray-300 rounded-full overflow-hidden">
                      <button
                        onClick={() =>
                          handleAttendance(student.studentId, false)
                        }
                        className={`px-4 py-1 text-sm font-medium transition
                        ${
                          attendance[student.studentId] === false
                            ? "bg-red-600 text-white"
                            : "bg-gray-200"
                        } 
                        rounded-l-full`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() =>
                          handleAttendance(student.studentId, true)
                        }
                        className={`px-4 py-1 text-sm font-medium transition
                        ${
                          attendance[student.studentId] === true
                            ? "bg-green-600 text-white"
                            : "bg-gray-200"
                        } 
                        rounded-r-full`}
                      >
                        Present
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-2">
            <button
              onClick={saveAttendance}
              className="bg-primary px-5 py-1 text-white rounded-full"
            >
              Save Attendance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDaily;
