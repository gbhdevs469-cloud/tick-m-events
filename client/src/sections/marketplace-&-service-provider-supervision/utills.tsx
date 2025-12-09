export const conflictServiceTableHeader= ["Date","Organizer","Provider","Issue","Status","Actions"];
export const conflictServiceTableData = [
{ date:"2025-02-12",organizer: "Jean M.", provider:"DJ Max",issue: "Non-compliance with terms", status: "Pending", actions: ["Make a Decision"] ,note: "Analyze a Conflict Contact the Parties"},
{ date:"2025-02-15",organizer: "Marie K.", provider:"EventPro",issue: "Late service delivery", status: "Urgent",note: "Analyze a Conflict Contact the Parties", actions: ["Make a Decision"] },
];
export const securityTransactionTableHeader=["Date","Provider","Amount","Payment Method","Status","Actions"];
export const securityTransactionTableData=[
{date:"2025-02-10",provider:"DJ Max",amount:"1,000,000 XAF",method:"Mobile Money",status:"Under Review",actions:["Block a Provider"],note:"Analyze a Transaction"},
{date:"2025-02-15",provider:"EventPro",amount:"800,000 XAF",method:"Credit Card",status:"Blocked",note:"Analyze a Transaction"},
];
export const signedContractTableHeader = ["Service", "Location", "Date", "Amount", "Status", "Actions"];
export const signedContractTableData = [
{ service: "DJ Entertainment", location: "Douala", date: "10/02/2025", amount: "250,000 XAF", status: "Signed", actions: ["View Contract"] },
{ service: "DJ Entertainment", location: "Douala", date: "10/02/2025", amount: "250,000 XAF", status: "Signed", actions: ["View Contract"] },
];

export const marketTrendsTableHeader = ["Provider","Number of Services","Revenue Earned","Satisfaction Rate"];
export const marketTrendsTableData = [
{ provider: "DJ Max", noService: "15", earned:"3,750,000 XAF",rate:"5"},
{ provider: "EventPro", noService: "25", earned: "3,750,000 XAF",rate:"5"},
];