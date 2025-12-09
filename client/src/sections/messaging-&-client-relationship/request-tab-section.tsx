import { Typography, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { MessagingAndClientRelationshipTable } from "src/components/tables/messaging-&-client-relationship-table";


function Detail({ label, value }: { label: string; value: string }) {
    return (
        <Box display="flex" mb={1}>
            <Typography fontWeight="bold" minWidth={145}>
                {label}:
            </Typography>
            <Typography sx={{ fontSize: "15px", fontWeight: "600", marginLeft: 2, }}>{value}</Typography>
        </Box>
    );
}

interface RequestSectionProps {
    title: string;
    description: string;
    headers: any[];
    data: any[];
    type: string;
    handleOpenModal: any
}

export function RequestTabSection({
    title,
    description,
    headers,
    data,
    type,
    handleOpenModal,

}: RequestSectionProps) {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [filteredData, setFilteredData] = useState<any[]>(data || []);
    const [uniqueOrganizers, setUniqueOrganizers] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            const organizersMap = new Map();
            data.forEach(item => {
                if (item.organizerId) {
                    organizersMap.set(item.organizerId._id, item.organizerId);
                }
            });
            setUniqueOrganizers(Array.from(organizersMap.values()));
        }
    }, [data]);

    useEffect(() => {
        if (selectedOption) {
            const filtered = data?.filter(item => item.organizerId?._id === selectedOption) || [];
            setFilteredData(filtered);
        } else {
            setFilteredData(data || []);
        }
    }, [selectedOption, data]);


    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} mb={2}>
                <Typography variant="h5" fontWeight="bold">
                    {title}
                </Typography>
                {
                    title === "Conversations" && (
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel id="data-select-label">Filter by Organizer</InputLabel>
                            <Select
                                labelId="data-select-label"
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(e.target.value)}
                                label="Filter by Organizer"
                            >
                                <MenuItem value="">
                                    <em>All Organizers</em>
                                </MenuItem>
                                {uniqueOrganizers.map((organizer) => (
                                    <MenuItem key={organizer._id} value={organizer._id}>
                                        {organizer.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )
                }
            </Box>
            <Typography variant="body2"
                fontWeight={500}
                mb={2}
                sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "17px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                }}>
                {description}
            </Typography>
            {selectedOption ? (
                <MessagingAndClientRelationshipTable
                    handleOpenModal={handleOpenModal}
                    headers={headers}
                    tableData={filteredData}
                    type={type}
                    selectedOption={selectedOption}
                />
            ) : (
                title === "Conversations" && (
                    <Box
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            backgroundColor: '#f5f5f5',
                            borderRadius: 1
                        }}
                    >
                        <Typography variant="h6" color="textSecondary">
                            Please select an Organizer
                        </Typography>
                    </Box>
                )

            )}
        </>
    );
};

