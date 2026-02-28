import { useState, useEffect } from "react";

const classes = [
  "CLASS_1","CLASS_2","CLASS_3","CLASS_4","CLASS_5",
  "CLASS_6","CLASS_7","CLASS_8","CLASS_9","CLASS_10",
  "CLASS_11","CLASS_12"
];

const fallbackStudents = [
  { name: "Adeola Ayo", score: 80 },
  { name: "Adeola Ayo", score: 79 },
  { name: "Adeola Ayo", score: 77 },
  { name: "Adeola Ayo", score: 80 },
  { name: "Adeola Ayo", score: 79 },
  { name: "Adeola Ayo", score: 77 },
];

const fallbackTopThree = [
  { name: "Joshua Ashiru", score: 90, medal: "🥇" },
  { name: "Adeola Ayo", score: 88, medal: "🥈" },
  { name: "Olawuyi Tobi", score: 85, medal: "🥉" },
];

const Home = () => {
  const [selectedClass, setSelectedClass] = useState("CLASS_11");
  const [students, setStudents] = useState([]);
  const [topThree, setTopThree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {      
    
    setLoading(true);

    setTimeout(() => {
      setStudents(fallbackStudents);
      setTopThree(fallbackTopThree);
      setLoading(false);
    }, 800);

  }, [selectedClass]);

  return (
    <div className="space-y-6">

      {/* Class Selector Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">

        <div className="text-red-500 text-sm text-center">
          Note: Currently showing dummy data.
        </div>

        <div className="flex items-center gap-4">
          <label className="font-medium">Select Class:</label>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Students Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">

        <div className="flex justify-between items-center bg-primary text-white rounded-md px-4 py-2">
          <span>All student performance</span>
          <span>{selectedClass}</span>
        </div>

        {loading ? (
          <div className="text-center py-6">Loading student data...</div>
        ) : (
          <div className="space-y-3">
            {students.map((student, index) => (
              <div
                key={index}
                className="flex justify-between bg-gray-100 px-4 py-2 rounded-md"
              >
                <span>{student.name}</span>
                <span>{student.score}%</span>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
};

export default Home;
