import {
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import axios from "src/redux/helper/axios";
import { toast } from "react-toastify";

type MetricCardProps = {
  selectedEvent: any;
};

export function MetricCard({ selectedEvent }: MetricCardProps) {

  // Helper to format money
  const formatCurrency = (value: number | undefined | null) => {
    const amount = typeof value === "number" && !Number.isNaN(value) ? value : 0;
    return `${amount.toLocaleString()} XAF`;
  };

  // Safe fallback for orders array
  const orders = selectedEvent?.orders || [];

  // 1. Total Sales (confirmed payments)
  const totalSales = orders
    .filter((order: any) => order.paymentStatus === "confirmed")
    .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

  // 2. Refunded Amount (if you ever track actual refunds)
  const refundedAmount = orders.reduce((sum: any, order: any) => {
    // Check if there are refund requests
    if (
      order.refundStatus === "requestedRefund" &&
      Array.isArray(order.refundRequests) &&
      order.refundRequests.length > 0
    ) {
      // Find any refund request marked as "refunded"
      const refundedReq = order.refundRequests.find(
        (r: any) => r.refundStatus === "refunded"
      );

      if (refundedReq) {
        // Add its refundAmount (or 0 if missing)
        return sum + (refundedReq.refundAmount || 0);
      }
    }

    return sum;
  }, 0);

  // 3. Pending Funds (paymentStatus === "pending")
  const pendingRefunds = orders.reduce((sum: number, order: any) => {
    if (Array.isArray(order.refundRequests)) {
      const pendingReqs = order.refundRequests.filter(
        (r: any) =>
          r.refundStatus === "processed" || r.refundStatus === "requestedRefund"
      );
      return (
        sum +
        pendingReqs.reduce(
          (innerSum: number, r: any) => innerSum + (r.refundAmount || 0),
          0
        )
      );
    }
    return sum;
  }, 0);

  const pendingWithdrawals = selectedEvent?.withdrawalDetails?.totals?.pendingAmount || 0;
  const pendingFunds = pendingRefunds + pendingWithdrawals;

  // 4. Available Balance = Total Sales - Refunded Amount
  const commission = totalSales * 0.10;
  const netSales = totalSales - refundedAmount;
  const approvedWithdrawals = selectedEvent?.withdrawalDetails?.totals?.approvedAmount || 0;
  const availableBalance = Math.max(0, netSales - commission - pendingWithdrawals - approvedWithdrawals);

  useEffect(() => {
    if (!selectedEvent?._id || Number.isNaN(availableBalance)) return undefined;

    const eventId = selectedEvent._id;

    const saveAvailableBalance = async () => {
      try {
        await axios.put(`/o/${eventId}/balance`, { availableBalance });
      } catch (error: any) {
        const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to update event balance. Please try again.";

    toast.error(message);
      }
    };

    saveAvailableBalance();
    const interval = setInterval(saveAvailableBalance, 60000);
    return () => clearInterval(interval);

  }, [selectedEvent?._id, availableBalance]);

  // Final metrics array
  const metrics = [
    {
      title: "Total Sales",
      value: formatCurrency(totalSales),
      color: "#2295D4",
      light: "rgb(75, 162, 209)",
    },
    {
      title: "Available Balance",
      value: formatCurrency(availableBalance),
      color: "#2C8743",
      light: "rgba(104, 196, 127, 0.5)",
    },
    {
      title: "Pending Funds",
      value: formatCurrency(pendingFunds),
      color: "#F9D000",
      light: "rgb(191, 178, 112)",
    },
    {
      title: "Refunded Amounts",
      value: formatCurrency(refundedAmount),
      color: "#F90004",
      light: "rgb(163, 74, 75)",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index} sx={{ textAlign: "center" }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              border: `2px solid ${metric.color}`,
              boxShadow: `-5px 0px 0px 0px ${metric.color}`,
              "&:hover": {
                boxShadow: `-12px 0 16px -5px ${metric.light}`,
              },
              transition: "box-shadow 0.3s ease",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                color="black"
                fontSize={20}
                fontWeight={600}
                gutterBottom
              >
                {metric.title}
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: metric.color, fontWeight: 600 }}
              >
                {metric.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
