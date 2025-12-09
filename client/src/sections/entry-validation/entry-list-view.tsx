import { Box, Button, TextField, Grid } from "@mui/material";
import { useMemo, useState } from "react";

import { useCSVExport, useExcelExport } from "src/hooks/downloadable";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { EventValidationTable } from "src/components/tables/event-validation-table";

import { entryValidationHeaders } from "./utills";


export function EntryListView({ _selectEve }: any) {
    const [ticketCodeFilter, setTicketCodeFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const exportToExcel = useExcelExport();
    const exportToCSV = useCSVExport();
    const filteredData = useMemo(() =>
        _selectEve?.verifiedTickets?.filter((item: any) =>
            item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
            item?.ticketCode?.toLowerCase().includes(ticketCodeFilter.toLowerCase())
        ),
        [searchTerm, ticketCodeFilter, _selectEve?.verifiedTickets]
    );

    const handleExcelExport = () => {
        exportToExcel(filteredData, {
            fileName: 'entry_list',
            sheetName: 'Entry List'
        });
    };

    const handleCSVExport = () => {
        exportToCSV(_selectEve?.verifiedTickets, {
            fileName: 'entry_list',
            headers: ['Name', 'Ticket Type', 'Entry Time', 'Status'],
            fieldNames: ['name', 'ticketType', 'entryTime', 'verifyEntry'] // Map to your actual data properties
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setTicketCodeFilter('');
    };
        // Check if filters are active
    const isFilterActive = searchTerm || ticketCodeFilter;
    return (
        <Box mt={3} boxShadow={3} borderRadius={3} p={3} bgcolor="white">
            <HeadingCommon title="Entry List View" color="#0B2E4C" weight={600} baseSize="33px" />
            {
                filteredData?.length ? (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search by Name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#0B2A4A',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#0B2A4A',
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Filter by Ticket Code"
                                value={ticketCodeFilter}
                                onChange={(e) => setTicketCodeFilter(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: '#0B2A4A',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#0B2A4A',
                                        },
                                    },
                                    backgroundColor: '#f8f9fa', // Light background color
                                }}
                            />
                        </Grid>

                        {filteredData?.length && isFilterActive && (
                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="outlined"
                                    onClick={clearFilters}
                                    
                                    sx={{
                                        p:1.8,
                                        color: "#0B2A4A",
                                        borderColor: "#0B2A4A",
                                        fontWeight: "bold",
                                        borderRadius: "8px",
                                        textTransform: "none",
                                        '&:hover': {
                                            backgroundColor: "#0B2A4A",
                                            color: "white",
                                            borderColor: "#0B2A4A",
                                        }
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </Grid>
                        )}

                    </Grid>
                ) : null

            }
            <EventValidationTable headers={entryValidationHeaders} data={filteredData} />

            {
                filteredData?.length ? <Box display="flex" gap={2} mt={2}>
                    <Button
                        variant="contained"
                        onClick={handleCSVExport}

                        sx={{
                            backgroundColor: "#0B2A4A",
                            color: "white",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            textTransform: "none"
                        }}
                    >
                        Download as CSV
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleExcelExport}

                        sx={{
                            backgroundColor: "#28A745",
                            color: "white",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            textTransform: "none"
                        }}
                    >
                        Download as Excel
                    </Button>
                </Box> : null
            }

        </Box>
    )
}