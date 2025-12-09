import { Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch, RootState } from 'src/redux/store';

import { getUserWithdrawals } from 'src/redux/actions/transactionPaymentActions';
import { TransactionAndPaymentTable } from "src/components/tables/transaction-&-payment-table";
import { WithdrawalTableHeaders } from "./utils";

// ✅ Type moved outside the component
type Withdrawal = {
    eventId: string,
    withdrawalId: string;
    amount: number;
    payment?: {
        paymentMethod?: string;
    };
    status: string;
    createdAt: string;
};
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = String(date.getFullYear()).slice(-2); // get last two digits

    return `${day}-${month}-${year}`;
};
function formatPaymentMethod(method: string = ""): string {
    return method
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function WithdrawalTableHistory({ selectedEvent }: any) {
    const dispatch = useDispatch<AppDispatch>();

    const withdrawals = useSelector((state: RootState) => state?.transactions.withdrawals) as Withdrawal[];

    useEffect(() => {
        dispatch(getUserWithdrawals());
    }, [dispatch]);

    const filteredWithdrawals = selectedEvent
        ? withdrawals.filter(w => w.eventId === selectedEvent._id)
        : [];

    const tableData = filteredWithdrawals.map((item) => ({
        withdrawalId: item.withdrawalId,
        "Date": formatDate(item.createdAt),
        amount: item.amount,
        paymentMethod: formatPaymentMethod(item.payment?.paymentMethod || "N/A"),
        action: item.status,
    }));

    return (
        <>
            <Typography variant="h5" fontSize={{ xs: 20, sm: 25, md: 33 }} fontWeight={600} sx={{ mt: 3 }}>
                Withdrawal Table History
            </Typography>

            <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 3, boxShadow: 3 }}>
                <TransactionAndPaymentTable
                    headers={WithdrawalTableHeaders}
                    data={tableData}
                    type="5"
                />
            </Paper>
        </>
    );
}
