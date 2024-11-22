import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const getEvents = async () => {
    try {
      const response = await axios.get("/api/calendar/getEvents");
      setEvents(response.data.data);
      console.log("Event Retrieval Successful", response.data.data);
      toast.success("Event Retrieval Successful");
    } catch (error) {
      console.error("Login error", error);
      toast.error("Login error");
    }
  };

  useEffect(() => {
    getEvents();
  }, []);
  return (
    <div className="w-full h-full p-[10px]">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
}
