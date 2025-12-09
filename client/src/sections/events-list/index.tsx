import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box } from "@mui/material";
import Footer from "src/components/Footer";
import Header from "src/components/Header";
import Hero from "./Hero";
import EventBooking from "./EventBooking";

interface Filters {
  eventType?: string;
  eventLocation?: string;
  eventDate?: string;
  eventPricing?: string;
}

export function EventList() {
  const dispatch = useDispatch();
  const { fullData, loading } = useSelector((state: any) => state.event);

  const [filters, setFilters] = useState<Filters>({});
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  const approvedEvents = useMemo(
    () => fullData?.filter((event: any) => event.status === "approved" && event.eventType !== "Private") || [],
    [fullData]
  );

  // Apply filters from HeroSection
  useEffect(() => {
    let filtered = approvedEvents;

    if (filters.eventType) {
      filtered = filtered.filter((event: any) =>
        event.eventType?.toLowerCase() === filters.eventType!.toLowerCase()
      );
    }

    if (filters.eventLocation) {
      filtered = filtered.filter((event: any) =>
        event.location?.toLowerCase().includes(filters.eventLocation!.toLowerCase())
      );
    }

    if (filters.eventDate) {
      filtered = filtered.filter((event: any) => {
        if (!event.date) return false;
        const eventDateStr = new Date(event.date).toISOString().split("T")[0];
        return eventDateStr === filters.eventDate;
      });
    }

    if (filters.eventPricing) {
      filtered = filtered.filter((event: any) => {
        const payStatus = event.tickets?.[0]?.payStatus || "free";
        return payStatus.toLowerCase() === filters.eventPricing!.toLowerCase();
      });
    }

    setFilteredEvents(filtered);
  }, [filters, approvedEvents]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <Box>
      <Header />
      <Hero
        approvedEvents={approvedEvents}
        loading={loading}
        onFilterChange={handleFilterChange}
      />
      <EventBooking filteredEvents={filteredEvents} />
      <Footer />
    </Box>
  );
}