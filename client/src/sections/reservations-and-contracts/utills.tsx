// Data for metric cards
export const metrics = [
    {
        title: "Active Contracts",
        value: "12",
        buttonType: "active"
    },
    {
        title: "Completed Projects",
        value: "8",
        buttonType: "completed"
    },
    {
        title: "Total Expected Payments",
        value: "1,500,000 XAF"
        
    }
];

export const requestDetails = {
    organizer: "EventPro",
    service: "Catering",
    budget: "600,000 XAF",
    location: "Douala",
    dateTime: "15/05/2025 - 12 PM",
    requirements: "Buffet for 150 people with vegetarian options Discussion",
    discussionStatus: "We’d like to finalize the menu before signing",
};

export const pendingRequestTableHeaders = ["Organizer", "Requested Service", "Budget", 'Status', "Actions"];
// export const tabLabels = ["Pending Requests", "Signed Contracts", "Ongoing & Completed"];
export const tabLabels = ["Active Contracts", "Completed Services"];

export const signedContractTableHeader = ["Service", "Location", "Date", "Amount", "Status", "Actions"];
export const signedContractTableData = [
    { service: "DJ Entertainment", location: "Douala", date: "10/02/2025", amount: "250,000 XAF", status: "Signed", actions: ["View Contract"] },
    { service: "DJ Entertainment", location: "Douala", date: "10/02/2025", amount: "250,000 XAF", status: "Signed", actions: ["View Contract"] },
];

export const serviceContract = {
    service: "Wedding Catering",
    organizer: "EventPro",
    provider: "Chef Elite",
    location: "Yaoundé ",
    date: "15/03/2025",
    amount: "600,000 XAF ",
    deposit: "10% (60,000 XAF) pending with TICK-M Remaining",
    payment: "90% due upon service delivery",
    "terms & Conditions": "Menu selection must be finalized a week before the event. Any cancellation after that incurs a 40% fee",
};

export const onServiceTableHeader = ["Service", "Location", "Date & Time", "Expected Payment", "Status", "Actions"];
export const onServiceTableData = [
    { service: "DJ Entertainment", location: "Douala", date: "10/02/2025 - 8 PM", amount: "250,000 XAF", status: "Pending Execution", actions: ["Confirm Completion", "Cancel"] },
    { service: "DJ Entertainment", location: "Douala", date: "10/02/2025 - 8 PM", amount: "250,000 XAF", status: "Pending Execution", actions: ["Confirm Completion", "Cancel"] },
];

export const expectedPaymentsTableHeader = ["Service", "Location", "Payment Method", "Amount", "Status", "Actions"];
export const expectedPaymentsTableData = [
    { service: "DJ Entertainment", location: "Douala", paymentMethod: "Mobile Money", amount: "250,000 XAF", status: "Pending", actions: ["View Transaction Details"] },
    { service: "DJ Entertainment", location: "Douala", paymentMethod: "Mobile Money", amount: "250,000 XAF", status: "Pending", actions: ["View Transaction Details"] },
];