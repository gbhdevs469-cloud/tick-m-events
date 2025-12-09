import {Typography} from "@mui/material";

import { ReservationsAndContractsTable } from "src/components/tables/reservations-&-contracts-table";

interface RequestSectionProps {
    title: string;
    description: string;
    headers: any[];
    data: any[];
    type: string;
    
}

export function RequestTabSection({
    title,
    description,
    headers,
    data,
    type
}: RequestSectionProps) {
    return (
        <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" mb={2}>
                {description}
            </Typography>

            <ReservationsAndContractsTable headers={headers} data={data} type={type} />
        </>
    );
};

