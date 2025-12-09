import { Typography, Box } from "@mui/material";

import { TransactionAndPaymentManagementTable } from "src/components/tables/transaction-&-payment-management-table";

interface RequestSectionProps {
    title: string;
    headers: any[];
    data: any[];
    type: string;
}

export function RequestTabSection({
    title,
    headers,
    data,
    type,
}: RequestSectionProps) {
    return (
        <>
            {
                type === "1" ? null : <Typography variant="h5" fontSize={{ xs: "18px", sm: "22px", md: "26px" }} fontWeight={600} gutterBottom>
                    {title}
                </Typography>
            }
            <TransactionAndPaymentManagementTable headers={headers} data={data} type={type} />
        </>
    );
};

