import { useState } from "react";
import { Box, Button } from "@mui/material";

import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

import { TicketReservationManagementTable } from "src/components/tables/ticket-reservation-management-table";
import { TicketCreationAndConfiguration } from "./ticket-creation-&-onfiguration";

export function TicketManagement({ tickets, selectedEvent }: any) {
    const [showTicketCreation, setShowTicketCreation] = useState(false);

    const ticketManagementTableHeaders = ["Ticket Name", "Price", "Quantity Available", "Ticket Description", "Remaining Stock", "Actions"];

    const handleTicketCreationSuccess = () => {
        setShowTicketCreation(false);
    };
    return (
        <Box>
            <HeadingCommon baseSize="33px" weight={600} variant="h5" title="Ticket Management" />

            <TicketReservationManagementTable
                headers={ticketManagementTableHeaders}
                data={tickets}
                type="1"
            />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#0B2E4E',
                        color: "#fff",
                        width: "90%",
                        '&:hover': { backgroundColor: '#2196F3' }
                    }}
                    disabled={!selectedEvent}
                    onClick={() => setShowTicketCreation((prev) => !prev)}
                >
                    {showTicketCreation ? "Cancel Adding Ticket" : "Add a Ticket"}
                </Button>
            </Box>

            {showTicketCreation && (
                <Box mt={4}>
                    <TicketCreationAndConfiguration onSuccess={handleTicketCreationSuccess}
                        eventId={selectedEvent._id} />
                </Box>
            )}
        </Box>
    )
}