import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";

const RightSidebar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [activeTab, setActiveTab] = useState("upcoming");

  // Fetch Events
  useEffect(() => {
    fetch("/v1/dashboard/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.payload) {
          const grouped = {};

          data.payload.forEach((event) => {
            const dateKey = dayjs(event.date).format("YYYY-MM-DD");
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(event);
          });

          setEvents(grouped);
        }
      })
      .catch((err) => console.error("Event fetch error:", err));
  }, []);

  // Upcoming Events (time-aware filter)
//   const upcomingEvents = Object.entries(events)
//     .flatMap(([date, arr]) =>
//       arr.map((ev) => ({
//         ...ev,
//         dateObj: dayjs(`${date} ${ev.startTime || "00:00"}`, "YYYY-MM-DD HH:mm"),
//       }))
//     )
//     .filter((ev) => ev.dateObj.isAfter(dayjs()))
//     .sort((a, b) => a.dateObj.diff(b.dateObj))
//     .slice(0, 5);
const upcomingEvents = Object.entries(events)
  .flatMap(([date, arr]) =>
    arr.map((ev) => ({
      ...ev,
      dateObj: dayjs(`${date} ${ev.startTime || ev.start_time}`, "YYYY-MM-DD HH:mm"),
    }))
  )
  .filter((ev) => ev.dateObj.isAfter(dayjs().startOf("day")))
  .sort((a, b) => a.dateObj.diff(b.dateObj))
  .slice(0, 5);

  // Show green dot on calendar if event exists
  const hasEvent = (date) => {
    const key = dayjs(date).format("YYYY-MM-DD");
    return events[key]?.length > 0;
  };

  return (
    <div className="p-4 w-full space-y-4">

      {/* Calendar */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={({ date, view }) =>
          view === "month" && hasEvent(date) ? (
            <div className="flex justify-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          ) : null
        }
        className="rounded-lg border-none"
      />

      {/* Toggle Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition
            ${
              activeTab === "upcoming"
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          Upcoming
        </button>

        <button
          onClick={() => setActiveTab("add")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition
            ${
              activeTab === "add"
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          Add Event
        </button>
      </div>

      {/* Upcoming Section */}
      {activeTab === "upcoming" && (
        <div className="space-y-3 max-h-[360px] overflow-y-auto">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, idx) => (
              <div key={idx} className="bg-gray-100 p-3 rounded-md">
                <div className="font-medium text-sm">
                  {event.eventName}
                </div>
                <div className="text-xs text-gray-600">
                  {event.dateObj.format("MMM DD, YYYY")} | {event.startTime}
                </div>
                {event.location && (
                  <div className="text-xs text-gray-500">
                    📍 {event.location}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">
              No upcoming events.
            </div>
          )}
        </div>
      )}

      {/* Add Event Section */}
      {activeTab === "add" && (
        <AddEventForm
          selectedDate={selectedDate}
          setEvents={setEvents}
        />
      )}
    </div>
  );
};

const AddEventForm = ({ selectedDate, setEvents }) => {
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(
    dayjs(selectedDate).format("YYYY-MM-DD")
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Sync form date when calendar changes
  useEffect(() => {
    setDate(dayjs(selectedDate).format("YYYY-MM-DD"));
  }, [selectedDate]);

  const handleSubmit = async () => {
    if (!eventName || !date || !startTime || !endTime) {
      alert("Please fill all required fields.");
      return;
    }

    const newEvent = {
      eventName,
      location,
      date,               // YYYY-MM-DD
      startTime,          // HH:mm
      endTime,            // HH:mm
      color: "#008000",
      cardColor: "#e6ffe6",
    };

    try {
      const res = await fetch("/v1/dashboard/addEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to add event.");
        return;
      }

      // Update local state immediately
      setEvents((prev) => {
        const updated = { ...prev };
        if (!updated[date]) updated[date] = [];
        updated[date].push(newEvent);
        return updated;
      });

      alert("Event created successfully!");

      // Reset form
      setEventName("");
      setLocation("");
      setStartTime("");
      setEndTime("");

    } catch (err) {
      console.error("Add event error:", err);
      alert("Failed to add event.");
    }
  };

  return (
    <div className="space-y-3">

      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        className="w-full border px-3 py-2 rounded-md text-sm"
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full border px-3 py-2 rounded-md text-sm"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border px-3 py-2 rounded-md text-sm"
      />

      <div className="flex flex-col">
        <span className="text-xs text-gray-600">Event Start Time</span>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="flex-1 border px-3 py-2 rounded-md text-sm"
        />
        <span className="text-xs text-gray-600">Event End Time</span>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="flex-1 border px-3 py-2 rounded-md text-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-primary text-white py-2 rounded-md text-sm font-medium"
      >
        Add Event
      </button>

    </div>
  );
};

export default RightSidebar;
