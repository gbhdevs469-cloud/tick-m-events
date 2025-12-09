import { Box, Button, Card, CardContent } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ApexOptions } from "apexcharts";

import { formatRevenue } from "src/hooks/format-revenu";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { Chart } from "src/components/chart";

export function WalletBalance({ selectedEvent }: any) {
    const navigate = useNavigate();

    // Calculate total confirmed sales
    const totalConfirmedSales = selectedEvent?.order
        ?.filter((order: any) => order.paymentStatus === "confirmed")
        .reduce((sum: number, order: any) => sum + order.totalAmount, 0) || 0;

    // Calculate base balance (90% of confirmed sales)
    const baseBalance = totalConfirmedSales * 0.9;

    // Calculate total approved withdrawals
    const totalApprovedWithdrawals = selectedEvent?.withdrawals
        ?.filter((withdrawal: any) => withdrawal.status === "approved")
        .reduce((sum: number, withdrawal: any) => sum + withdrawal.amount, 0) || 0;

    // Calculate final wallet balance
    const walletBalance = baseBalance - totalApprovedWithdrawals;

    // Prepare revenue chart data
    const orders = selectedEvent?.order ?? [];
    const revenueByMonth: Record<string, number> = {};

    orders.forEach((order: any) => {
        if (order.paymentStatus === "confirmed") {
            const date = new Date(order.createdAt);
            const monthYear = date.toLocaleString("default", {
                month: "short",
                year: "numeric",
            });

            revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + order.totalAmount;
        }
    });

    const labels = Object.keys(revenueByMonth);
    const seriesData = Object.values(revenueByMonth);

    const chartrevenuSeries = [
        {
            name: "Monthly Revenue (XAF)",
            data: seriesData,
        },
    ];

    const chartrevenuOptions: ApexOptions = {
        chart: {
            type: "line",
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        stroke: { curve: "smooth" },
        xaxis: {
            categories: labels,
            title: { text: "Month" },
        },
        yaxis: {
            title: { text: "Revenue (XAF)" },
        },
        colors: ["#0B2E4E"],
    };

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                p: 2,
                borderRadius: 3,
                boxShadow: 3,
                my: 4,
            }}
        >
            {/* Wallet Balance */}
            <CardContent
                sx={{
                    flex: 1,
                    backgroundColor: "#2395D4",
                    color: "#fff",
                    borderRadius: 2,
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <HeadingCommon title="Wallet Balance" color="#fff" baseSize="22px" weight={700} mb={0} />
                <HeadingCommon title={formatRevenue(walletBalance)} color="#fff" baseSize="20px" weight={700} mt={0} mb={0} />

                <Box display="flex" gap={2} mt={1}>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                            fontSize: { xs: 12, sm: 13, md: 14 }
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/transaction-and-payment', { state: { scrollTo: 't&pay' } });
                        }}
                    >
                        Withdraw
                    </Button>
                </Box>

                <HeadingCommon title="Transaction History:" variant="body2" color="#fff" baseSize="14px" mt={1} />
                <HeadingCommon title={`• +${formatRevenue(totalConfirmedSales)} (Total Sales)`} variant="body2" color="#fff" baseSize="13px" mt={0} mb={0} />
                <HeadingCommon title={`• -${formatRevenue(totalConfirmedSales * 0.1)} (10% Platform Fee)`} variant="body2" color="#fff" baseSize="13px" mt={0} mb={0} />
                {totalApprovedWithdrawals > 0 && (
                    <HeadingCommon title={`• -${formatRevenue(totalApprovedWithdrawals)} (Withdrawals)`} variant="body2" color="#fff" baseSize="13px" mt={0} mb={0} />
                )}
            </CardContent>

            {/* Sales Revenue Chart */}
            <CardContent
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <HeadingCommon title="Sales Revenue" baseSize="22px" weight={700} mb={0} />
                <Chart
                    options={chartrevenuOptions}
                    series={chartrevenuSeries}
                    type="line"
                    height={200}
                />
                <Link to="/marketing-engagement">
                    <Button
                        variant="contained"
                        sx={{
                            fontSize: { xs: 12, sm: 13, md: 14 },
                            mt: 1,
                            backgroundColor: "#0B2E4E",
                            width: "100%",
                            fontWeight:600
                        }}
                    >
                        Boost Sales
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}