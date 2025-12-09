export const GeneralConversationsTableHeaders = ["Organizer", "Service Concerned", "Last Message", "Status", "Action"];

export const ChatOrganizerTableHeaders = ["Location", "Date & Time", "Budget", "Description"];
export const ChatOrganizerTableData = [
  { location: "Douala, Prestige Hall", datetime: "Feb 10, 2025, at 8 PM", budget: "250,000 XAF (negotiable)", describe: "DJ animation with sound system provided" }
];
export const NotificationsFollowUpTableHeader = ["Date", "Service", "Total Amount (XAF)", "Commission (10%)", "Final Amount Received", "Actions"];
export const NotificationsFollowUpTableData = [
  { service: "Your quote needs to be updated.", actions: ["Mark as Read", "Resend Follow-up Message"] },
  { service: "Reminder: Pending response from the client.", actions: ["Mark as Read", "Resend Follow-up Message"] },

];


export const SharedFilesDocumentsTableHeader = ["File Name", "Sent Date", "Type", "Actions"];
export const SharedFilesDocumentsTableData = [
  { file: "Quote-DJ-JeanM.pdf", sdate: "02/10/2025", type: "Quote", actions: ["Download",] },
  { file: "Catering-Wedding-Contract.pdf", sdate: "02/10/2025", type: "Contract", actions: ["Download"] },
];

export const paymentSettings = {
  configurableMethods: [
    "Mobile Money (MTN MoMo, Orange Money)",
    "Bank Transfer",
    "Cash"
  ],
  formTitle: "Friends Who Booked",
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
