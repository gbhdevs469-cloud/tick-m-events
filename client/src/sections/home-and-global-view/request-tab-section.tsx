import { Paper, Typography, Box, Button, TextField, MenuItem, Stack } from "@mui/material";
import { useState } from "react";
import DatePicker from "@mui/lab/DatePicker";
import { HomeAndGlobalTable } from "src/components/tables/home-and-global-table";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

interface RequestSectionProps {
    title: string;
    description: string;
    headers: any[];
    data: any[];
    type: string;
    onApply?: (row: any) => void;
    onViewDetails?: (row: any) => void;
    onMarkCompleted?: (row: any) => void;
}

export function RequestTabSection({
    title,
    description,
    headers,
    data,
    type,
    onApply,
    onViewDetails,
    onMarkCompleted,
}: RequestSectionProps) {
    const [filters, setFilters] = useState({
        eventName: '',
        budget: '',
        date: null
    });

    const handleFilterChange = (e: any) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date: any) => {
        setFilters(prev => ({
            ...prev,
            date
        }));
    };

    const filteredData = data?.filter(item => {
        // Filter by event name
        if (filters.eventName && !item.eventId.eventName.toLowerCase().includes(filters.eventName.toLowerCase())) {
            return false;
        }

        // Filter by budget
        if (filters.budget) {
            const [min, max] = filters.budget.split('-').map(Number);
            const itemBudget = item.serviceRequestId.budget;
            const itemMin = Number(itemBudget.split('-')[0].replace(/\D/g, ''));
            const itemMax = Number(itemBudget.split('-')[1].replace(/\D/g, ''));

            if (itemMin > max || itemMax < min) {
                return false;
            }
        }

        // Filter by date
        if (filters.date) {
            const filterDate = new Date(filters.date).setHours(0, 0, 0, 0);
            const itemDate = new Date(item.eventId.date).setHours(0, 0, 0, 0);
            if (filterDate !== itemDate) {
                return false;
            }
        }

        return true;
    });

    const budgetRanges = [
        { label: "All Budgets", value: "" },
        { label: "0 - 10,000 XAF", value: "0-10000" },
        { label: "10,000 - 100,000 XAF", value: "10000-100000" },
        { label: "100,000 - 1,000,000 XAF", value: "100000-1000000" },
        { label: "1,000,000+ XAF", value: "1000000-10000000" }
    ];

    return (
        <Paper elevation={6}
                sx={{
                    mt: 2,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: "hidden",
                }}>
            <HeadingCommon title={title} />


            <Typography variant="body2" mb={2}>
                {description}
            </Typography>

            {/* Filter Controls */}
            {
                data?.length > 0 && title === 'Available Projects (Organizer Requests)' && (
                    <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                label="Search Event Name"
                                variant="outlined"
                                size="small"
                                name="eventName"
                                value={filters.eventName}
                                onChange={handleFilterChange}
                                sx={{ minWidth: 200 }}
                            />

                            <TextField
                                select
                                label="Budget Range"
                                variant="outlined"
                                size="small"
                                name="budget"
                                value={filters.budget}
                                onChange={handleFilterChange}
                                sx={{ minWidth: 250 }} // Increased width for better readability
                            >
                                {budgetRanges.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <DatePicker
                                label="Filter by Date"
                                value={filters.date}
                                onChange={handleDateChange}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        sx={{ minWidth: 200 }}
                                    />
                                )}
                            />

                            <Button
                                variant="outlined"
                                onClick={() => setFilters({
                                    eventName: '',
                                    budget: '',
                                    date: null
                                })}
                                sx={{ height: 40 }}
                            >
                                Clear Filters
                            </Button>
                        </Stack>
                    </Box>
                )
            }

            <HomeAndGlobalTable
                headers={headers}
                data={filteredData}
                type={type}
                onApply={onApply}
                onViewDetails={onViewDetails}
                onMarkCompleted={onMarkCompleted}
            />
            {
                filteredData?.length > 0 && (
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Typography variant="body2" fontStyle="italic" color="text.secondary">
                            NB: Negotiable Budget
                        </Typography>
                    </Box>
                )
            }
        </Paper>
    );
};