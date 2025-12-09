// Payment History
export const ticketOptions = [
  { label: "All Tickets", value: "all" }, // Add "All" option
  { label: "Ticket-321", value: "Ticket-321" },
  { label: "Ticket-322", value: "Ticket-322" },
  { label: "Ticket-323", value: "Ticket-323" },
];

export const ticketDate = [
  { label: "All Dates", value: "all" }, // Add "All" option
  { label: "12-12-25", value: "12-12-25" },
  { label: "1-12-25", value: "1-12-25" },
  { label: "2-12-25", value: "2-12-25" },
];

export const tableHeaders = ["Date", "Reference", "Amount", "Type", "Payment Method", "Status", "Details"];

export const allTableData = [
  { date: "12-12-25", reference: "Ticket-321", amount: "150,000 XAF", type: "Ticket Sale", paymentmethod: "Visa", status: "Approved", details: "View" },
  { date: "1-12-25", reference: "Ticket-322", amount: "150,000 XAF", type: "Refund", paymentmethod: "MoMo", status: "Pending", details: "View" },
  { date: "2-12-25", reference: "Ticket-323", amount: "150,000 XAF", type: "Ticket Sale", paymentmethod: "Orange Money", status: "Approved", details: "View" },
];

// Withdrawal Table History 
export const WithdrawalTableHeaders = ["Withdrawal ID", "Date", "Amount", "Method", "Status"];

export const WithdrawalTableData = [
  { WithdrawalId: "#R002", date: "12-12-25", amount: "150,000 XAF", method: "Credit Card", status: "Approved" },
  { WithdrawalId: "#R001", date: "1-12-25", amount: "150,000 XAF", method: "Mobile Money (MTN)", status: "Pending" },
  { WithdrawalId: "#R003", date: "2-12-25", amount: "150,000 XAF", method: "Bank Transfer", status: "Approved" },
];

// Refund Management
export const RefundTableHeaders = ["Transaction", "Participant", "Ticket Type", "Purchase Date", "Amount", "Status"];

// Invoices & Reports
export const InvoiceTableHeaders = ["Invoice ID", "Date", "Amount", "Method", "Status", "Action"];

export const InvoiceTableData = [
  { invoiceId: "#001247", date: "12-12-25", amount: "20,000 XAF", method: "Credit Card", status: "Approved", action: ["Download PDF"] },
  { invoiceId: "#001244", date: "12-12-25", amount: "20,000 XAF", method: "Credit Card", status: "Pending", action: ["Download PDF"] },
  { invoiceId: "#001242", date: "12-12-25", amount: "20,000 XAF", method: "Credit Card", status: "Approved", action: ["Download PDF"] },
];

// Payment Settings & Prefrences
export const PaymentSettingTableHeaders = ["Type", "Number/IBAN", "Status", "Action"];

export const PaymentSettingTableData = [
  { type: "Mobile Money", numberAndIban: "+237 6xxxx xxxx", status: "Approved", details: "Edit" },
  { type: "Mobile Money", numberAndIban: "+237 6xxxx xxxx", status: "Pending", details: "Edit" },
  { type: "Mobile Money", numberAndIban: "+237 6xxxx xxxx", status: "Approved", details: "Edit" },
];

export interface Order {
  paymentStatus: string;
  totalAmount: number;
  paymentMethod?: string;
  transactionId: number;

}
export interface EventData {
  _id: string;
  totalApprovedWithdrawals?: number;
  eventName: string;
  availableBalance: number;
  orders?: Order[];
};

// utils/mapOrdersToAllTableData.ts
export function mapOrdersToAllTableData(orders: any[]) {
  return orders.map((order) => {
    const hasRefund = order.refundRequests && order.refundRequests.length > 0;

    if (hasRefund) {
      const refund = order.refundRequests[0];
      return {
        date: new Date(refund.createdAt).toLocaleDateString("en-GB"),
        reference: order.transactionId,
        amount: `${refund.refundAmount} XAF`,
        type: "Refund",
        paymentmethod: refund.paymentMethod
          ? refund.paymentMethod.toUpperCase()
          : "-",
        status: refund.refundStatus
          ? refund.refundStatus.charAt(0).toUpperCase() +
          refund.refundStatus.slice(1)
          : "-",
        details: "View",
      };
    }

    return {
      date: new Date(order.createdAt).toLocaleDateString("en-GB"),
      reference: order.transactionId,
      amount: `${order.totalAmount} XAF`,
      type: "Ticket Sale",
      paymentmethod: order.paymentMethod
        ? order.paymentMethod.toUpperCase()
        : "-",
      status: order.paymentStatus === "confirmed" ? "Approved" : "Pending",
      details: "View",
    };
  });
}
