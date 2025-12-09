import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Box, Typography, Button, useMediaQuery, Popover, Stack } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import { AppDispatch, RootState } from "src/redux/store";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { getRequestsByProvider } from "src/redux/actions/service-request";

import { ServiceRequestModal } from "../../components/modal/service-request-modal";
import "./index.css";

const options = ["View Details"];

export const CalenderView = () => {

    // ✅ USE allActiveProjects instead of completed/signed arrays
    const { allActiveProjects } = useSelector((state: RootState) => state.serviceRequest);

    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(getRequestsByProvider());
    }, [dispatch]);

    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const eventDays: { [key: string]: string } = {};

    // --------------------------------------------------------------------
    // ✅ Mark event circles using ALL ACTIVE PROJECTS and serviceTime only
    // --------------------------------------------------------------------
    allActiveProjects?.forEach((p: any) => {
        const serviceDate = p.serviceTime || p.projectId?.serviceTime;
        if (!serviceDate) return;

        const key = new Date(serviceDate).toLocaleDateString("en-CA");

        if (p.projectStatus === "completed") {
            eventDays[key] = "gold";
        } else if (p.isSigned || p.projectId?.isSigned) {
            eventDays[key] = "red";
        }
    });


    // -------- Same utility functions (NOT touched) --------
    const getWeekStart = (date: Date): Date => {
        const newDate = new Date(date);
        const day = newDate.getDay();
        newDate.setDate(newDate.getDate() - day);
        return newDate;
    };

    const getWeekEnd = (date: Date): Date => {
        const start = getWeekStart(date);
        const newDate = new Date(start);
        newDate.setDate(start.getDate() + 6);
        return newDate;
    };

    const getCurrentWeekDates = (date: Date): Date[] => {
        const start = getWeekStart(date);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    };

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));

    const [value, setValue] = useState(new Date());
    const [viewType, setViewType] = useState<"month" | "week" | "day">("month");

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // --------------------------------------------------------------------
    // ✅ MATCH click with allActiveProjects → by serviceTime
    // --------------------------------------------------------------------
    const handleTileClick = (date: Date, event: any) => {
        const key = date.toLocaleDateString("en-CA");

        const matchedProject = allActiveProjects?.find((p: any) => {
            const serviceDate = p.serviceTime || p.projectId?.serviceTime;
            if (!serviceDate) return false;

            const projectKey = new Date(serviceDate).toLocaleDateString("en-CA");
            return projectKey === key;
        });

        if (matchedProject) {
            setSelectedRequest(matchedProject);
            setAnchorEl(event.currentTarget);
        } else {
            setSelectedRequest(null);
            setAnchorEl(null);
        }
    };

    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);

    const handlePrev = () => {
        const newDate = new Date(value);
        newDate.setMonth(value.getMonth() - 1);
        setValue(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(value);
        newDate.setMonth(value.getMonth() + 1);
        setValue(newDate);
    };

    const handleViewChange = (type: "month" | "week" | "day") => setViewType(type);

    const eventName =
        selectedRequest?.eventId?.eventName ||
        selectedRequest?.projectId?.eventId?.eventName ||
        "No Title";

    const eventDate =
        selectedRequest?.serviceTime ||
        selectedRequest?.projectId?.serviceTime ||
        null;


    return (
        <Box>
            {/* Header */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                bgcolor="#1F8FCD"
                p={2}
            >
                <HeadingCommon
                    baseSize="26px"
                    variant="h6"
                    weight={600}
                    title="Service Calendar View"
                    color="white"
                />

                <Box display="flex" alignItems="center" gap={2}>
                    <Button onClick={handlePrev} sx={{ borderRadius: 3, color: "black", backgroundColor: "white", p: "5px", minWidth: "38px" }}>
                        <ArrowBack />
                    </Button>

                    <Typography variant="h6" color="white">
                        {value.toLocaleString("default", { month: "long" })} {value.getFullYear()}
                    </Typography>

                    <Button onClick={handleNext} sx={{ borderRadius: 3, color: "black", backgroundColor: "white", p: "5px", minWidth: "38px" }}>
                        <ArrowForward />
                    </Button>
                </Box>

                <Box display="flex" gap={1} mt={isXs ? 2 : 0}>
                    <Button variant={viewType === "month" ? "contained" : "outlined"} size="small" sx={{ color: "#0B2E4C", backgroundColor: "white" }} onClick={() => handleViewChange("month")}>
                        Month
                    </Button>
                    <Button variant={viewType === "week" ? "contained" : "outlined"} size="small" sx={{ color: "#0B2E4C", backgroundColor: "white" }} onClick={() => handleViewChange("week")}>
                        Week
                    </Button>
                    <Button variant={viewType === "day" ? "contained" : "outlined"} size="small" sx={{ color: "#0B2E4C", backgroundColor: "white" }} onClick={() => handleViewChange("day")}>
                        Day
                    </Button>
                </Box>
            </Box>

            {/* Month View */}
            {viewType === "month" && (
                <Box
                    sx={{
                        overflowX: "auto",
                        ".react-calendar__tile": {
                            height: 65,
                            width: 212,
                            maxWidth: "none !important",
                        },
                        ".react-calendar": {
                            width: "100%",
                        },
                    }}
                >
                    <Calendar
                        onClickDay={handleTileClick}
                        value={value}
                        tileClassName={({ date }) => {
                            const key = date.toLocaleDateString("en-CA");
                            if (eventDays[key] === "red") return "tile-red";
                            if (eventDays[key] === "gold") return "tile-gold";
                            return "";
                        }}
                        prevLabel={null}
                        nextLabel={null}
                    />

                    {/* Popup */}

                </Box>
            )}

            {/* Week View — unchanged design, only color logic updated */}
            {viewType === "week" && (
                <Box p={2}>
                    <Typography variant="h6" mb={2}>
                        Week of {getWeekStart(value).toDateString()} - {getWeekEnd(value).toDateString()}
                    </Typography>

                    <Box
                        display="grid"
                        gridTemplateColumns="repeat(7, 1fr)"
                        gap={2}
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            p: 2,
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        {getCurrentWeekDates(value).map((date) => {
                            const key = date.toLocaleDateString("en-CA");
                            const eventColor = eventDays[key];
                            const isToday = date.toDateString() === new Date().toDateString();

                            const bgColor = isToday ? "#1976d2" : eventColor || "#fff";

                            return (
                                <Box
                                    key={key}
                                    onClick={(e) => handleTileClick(date, e)}
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor: bgColor,
                                        height: 100,
                                        cursor: "pointer",
                                        p: 1,
                                        boxShadow: eventColor ? 2 : 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        color: isToday || eventColor ? "white" : "black",
                                    }}
                                >
                                    <Typography fontWeight="bold">
                                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                                    </Typography>
                                    <Typography>{date.getDate()}</Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            )}

            {/* Day View — unchanged */}
            {viewType === "day" && (
                <Box p={2}>
                    <Typography variant="h6" gutterBottom>
                        Events on {value.toDateString()}
                    </Typography>

                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: "#1976d2",
                            color: "white",
                            boxShadow: 3,
                            textAlign: "center",
                            minHeight: "100px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="h4">{value.getDate()}</Typography>
                        <Typography variant="subtitle1">
                            {value.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                year: "numeric",
                            })}
                        </Typography>

                        {eventDays[value.toLocaleDateString("en-CA")] && (
                            <Typography mt={2}>
                                Event Color:{" "}
                                <span style={{ fontWeight: "bold" }}>
                                    {eventDays[value.toLocaleDateString("en-CA")]}
                                </span>
                            </Typography>
                        )}
                    </Box>
                </Box>
            )}

            {/* Popup actions — same */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Box sx={{ p: 2, maxWidth: 300 }}>

                    {/* Event Card */}
                    {selectedRequest ? (
                        <>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {eventName}
                            </Typography>

                            <Typography variant="body2">
                                Date: {eventDate ? new Date(eventDate).toLocaleDateString() : "Invalid Date"}
                            </Typography>

                            <Typography variant="body2">
                                Time: {eventDate ? new Date(eventDate).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }) : "Invalid Time"}
                            </Typography>
                            <Typography variant="body2" mb={1}>
                                Status: {selectedRequest.contractStatus || selectedRequest.projectStatus}
                            </Typography>
                        </>
                    ) : (
                        <Typography>No event</Typography>
                    )}

                    {/* Options */}
                    <Stack spacing={1} mt={2}>
                        {options.map((option, i) => (
                            <Button
                                key={i}
                                variant="text"
                                fullWidth
                                onClick={() => {
                                    if (option === "View Details") {
                                        setIsModalOpen(true);
                                    }
                                    handleClose();
                                }}
                            >
                                {option}
                            </Button>
                        ))}
                    </Stack>

                </Box>
            </Popover>


            {selectedRequest && (
                <ServiceRequestModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={selectedRequest} />
            )}
        </Box>
    );
};
