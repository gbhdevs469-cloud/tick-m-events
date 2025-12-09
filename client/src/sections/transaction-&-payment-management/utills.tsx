// Data for metric cards
const currentBalance = 2500;
const commissionRate = 0.1;

export const metrics = [
  { title: "Current Balance", value: `${currentBalance} XAF` },
  { title: "Pending Payments", value: `500 XAF` }, // Keep as-is or calculate if needed
  {
    title: "Deducted Commissions",
    value: `${currentBalance * commissionRate} XAF`
  }
];

export const transactionsPaymentHistoryTableHeaders = ["Date","Service","Location","Total Amount (XAF)","Commision","Received Amount","Payment Method","Status","Actions"];
export const transactionsPaymentHistoryTableData = [
    { date: "10/02/2025", requestedService: "DJ Animation", location: "Douala",amount: "225,000",commision: "10%",receivedAmount:"2500",paymentMethod:"Mobile Money",status:"Received", actions: ["View Details","Download Receipt",] },
    { date: "10/02/2025", requestedService: "Wedding Catering",location: "Yaoundé", amount: "540,000",commision: "10%",receivedAmount:"2500",paymentMethod:"Bank Transfer",status:"Pending", actions: ["View Details","Download Receipt"] },
];

export const tickCommissionsDeductionsTableHeader = ["Date","Service","Total Amount (XAF)","Commission (10%)","Final Amount Received","Actions"];
export const tickCommissionsDeductionsTableData = [
    { date: "10/02/2025", requestedService: "DJ Animation", totalamount: "250,000 XAF" },
    { date: "10/02/2025", requestedService: "Wedding Catering", totalamount: "600,000 XAF" },
].map((item) => {
    const total = parseInt(item.totalamount.replace(/[^\d]/g, ""), 10);
    const commissionValue = total * 0.10;
    const finalAmountValue = total - commissionValue;
    const commission = `${commissionValue.toLocaleString()} XAF`;
    const finalAmount = `${finalAmountValue.toLocaleString()} XAF`;

    return {
        ...item,
        commission,
        finalAmount,
        actions: ["View Details", "Download Receipt"]
    };
});


export const InvoicesAndReceiptsTableHeader = ["Date","Service","Document Type","Actions"];
export const InvoicesAndReceiptsTableData = [
    { date: "10/02/2025", requestedService: "DJ Animation", documentType:"Payment Receipt", actions: ["Download",] },
    { date: "10/02/2025", requestedService: "Wedding Catering",documentType:"Accounting Invoice", actions: ["Download"] },
];

export const paymentSettings = {
    configurableMethods: [
      "Mobile Money (MTN MoMo, Orange Money)",
      "Bank Transfer",
      // "Cash"
      "Visa or master card"
    ],
    bankingFields: [
      "Account Holder Name",
      "Mobile Money Number",
      "IBAN",
      "Swift Code",
      "Card Details"
    ],
    buttons: [
      "Add a Payment Method",
      "Update My Information"
    ]
  };
  

 export const bankingHeaders = [
  "Account Holder Name",
  "Account Number",
  "Bank",
  "CIF Number",
  "Actions",
];

export const mobileMoneyHeaders = [
  "Mobile Money Number",
  "Provider",
  "Actions",
];

export const cardHeaders = [
  "Cardholder Name",
  "Card Number",
  "Expiry Date",
  "CVV",
  "Actions",
];