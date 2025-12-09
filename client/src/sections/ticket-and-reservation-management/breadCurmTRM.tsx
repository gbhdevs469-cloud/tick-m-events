import { Box, Button,Select, MenuItem,Typography, Stack,FormControl } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface Event {
  _id: string;
  eventName: string;
  // Add other event properties as needed
}

// Custom Status Chip component
function StatusChip({ label, color }: { label: string; color: string }) {
    return (
        <Box display="flex" alignItems="center" gap={0.5}>
            <CircleIcon sx={{ color, fontSize: 12 }} />
            <Typography fontWeight={500} fontSize={13}>{label}</Typography>
        </Box>
    );
}

export function BreadCrumTRM({ view, setView, eventInformation, events, onEventSelect }: any) {
    const location = useLocation();
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    // Define the specific URL path where the section should appear
    const showSection = location.pathname === '/entry-validation';
     useEffect(() => {
        if (events && events.length > 0 && !selectedEvent) {
            const firstEvent = events[0];
            setSelectedEvent(firstEvent);
            onEventSelect(firstEvent);
        }
    }, [events, selectedEvent, onEventSelect]);

    const handleChange = (e: any) => {
        const selectedId = e.target.value;
        const event = events.find((ev: any) => ev._id === selectedId) || null;
        setSelectedEvent(event);
        onEventSelect(event);
    };
    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            key={eventInformation?._id}
        >
            {/* Left Section: Event & Status */}
            {!showSection && (
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                    <Typography fontWeight={600} fontSize={13}>Event</Typography>
                    <Typography color="text.secondary" fontSize={13}>/</Typography>
                    <FormControl sx={{ minWidth: 150 }} size="small">
                        <Select
                            value={selectedEvent?._id || ''}
                            onChange={handleChange}
                            displayEmpty
                            size="small"
                            sx={{
                                fontSize: '0.8rem',
                                height: '25px',
                                '& .MuiSelect-select': {
                                    padding: '6px 12px'
                                },
                                textTransform: "capitalize"
                            }}
                        >
                            <MenuItem value="" disabled>
                                Select an event
                            </MenuItem>
                            {events?.map((event:any) => (
                                <MenuItem
                                    key={event._id}
                                    value={event._id}
                                    sx={{
                                        fontSize: '0.8rem',
                                        minHeight: '32px',
                                        textTransform: "capitalize"
                                    }}
                                >
                                    {event.eventName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}

            {showSection && (
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                    <Typography fontWeight={600} fontSize={13}>Event</Typography>
                    <Typography color="text.secondary" fontSize={13}>/</Typography>
                    <Typography color="text.secondary" fontSize={13}>{eventInformation?.eventName || "select code"}</Typography>
                </Box>
            )}

            {/* Right Section: Connection Status + View Buttons */}
            {showSection && (
                <Box display="flex" alignItems="center" gap={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight={600} fontSize={13}>Connection Status :</Typography>
                        <StatusChip label="Online" color="green" />
                        <StatusChip label="Offline" color="grey" />
                    </Stack>

                    <Box display="flex" gap={1}>
                        <Button
                            variant={view === 'scan' ? 'contained' : 'text'}
                            onClick={() => setView('scan')}
                            sx={{ fontSize: 13 }}
                        >
                            Scan View
                        </Button>
                        <Button
                            variant={view === 'list' ? 'contained' : 'text'}
                            onClick={() => setView('list')}
                            sx={{ fontSize: 13 }}
                        >
                            List View
                        </Button>
                    </Box>
                </Box>
            )}

        </Box>
    )
}