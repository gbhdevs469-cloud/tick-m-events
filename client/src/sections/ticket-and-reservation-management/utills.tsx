import { ApexOptions } from "apexcharts";


export const chartOptions: ApexOptions = {
    chart: {
        type: "line",
        toolbar: { show: false },
    },
    xaxis: {
        categories: ["April", "May", "June", "July", "August", "September", "October"],
    },
    stroke: { curve: "smooth" },
    markers: { size: 5 },
    colors: ["#2395D4"],
};

export const chartSeries = [{ name: "Sales", data: [600, 400, 300, 450, 500, 200, 150] }];
// Dummy data
export const tickets = [
    {
        name: "Standard",
        price: "20",
        quantity: "100",
        description: "Access to general areas",
        stock: "80",
    },
    {
        name: "VIP",
        price: "Free",
        quantity: "Unlimited",
        description: "Access to VIP areas",
        stock: "30",
    },
];

export const tableHeaders = ["Ticket Type", "Price", "Total Stock", "Remaining Stock", "Tickets Sold", "Revenue Generated"];
export const tableData = [
    { type: "Standard", price: "10,000 XAF", total: 500, remaining: 230, sold: 270, revenue: "2,700,000 XAF" },
    { type: "VIP", price: "20,000 XAF", total: 200, remaining: 50, sold: 150, revenue: "3,000,000 XAF" },
    { type: "Advanced", price: "30,000 XAF", total: 300, remaining: 100, sold: 200, revenue: "6,000,000 XAF" },
];

export const tableHeadersFirst = ["Ticket Name", "Price", "Quantity Available", "Ticket Description", "Remaining Stock", "Actions"];
export const tableDataFirst = [
    { type: "Standard", price: "20", total: 100, remaining: "Access to general areas", sold: 800, revenue: "2,700,000 XAF" },
    { type: "VIP", price: "Free", total: "Unlimited", remaining: "Access to VIP areas", sold: 30, revenue: "3,000,000 XAF" },
];

export const tableHeadersSecond = ["Name", "Email", "Ticket Type", "Purchase Date", "Status", "Actions"];
export const tableDataSecond = [
    { type: "Jean M", price: "jean@email.com", total: "VIP", remaining: "02/02/2025", sold: ["Pending", "Confirmed", "Canceled"], revenue: "Cancel" },
    { type: "Jean M", price: "jean@email.com", total: "VIP", remaining: "02/03/2025", sold: ["Pending", "Confirmed", "Canceled"], revenue: "Cancel" },
    { type: "Jean M", price: "jean@email.com", total: "VIP", remaining: "02/04/2025", sold: ["Pending", "Confirmed", "Canceled"], revenue: "Cancel" },
];

export const realTimeSalseTrackingTableHeaders = ["Ticket Type", "Price", "Total Stock", "Remaining Stock", "Tickets Sold", "Revenue Generated"];

// Reservation Manangement
export type ListViewMethod = 'manualCode' | 'nameList' | 'accountId';

export interface ValidationOptions {
 selectedView: 'scan' | 'list' | 'both';
  listViewMethods: ListViewMethod[];
}

export const chartRealTimeOptions: ApexOptions = {
    series: [45, 30, 25], // Ticket Sold, Validation, Remaining
    labels: ["Ticket Sold", "Ticket validated", "Remaining Tickets"],
    chart: { type: "donut" },
    colors: ["#2395D4", "#002E4E", "#29A71A"], // Match colors from screenshot
    legend: { position: "bottom", markers: { strokeWidth: 8 } },
    dataLabels: { enabled: true },
    responsive: [{ breakpoint: 768, options: { legend: { position: "bottom" } } }],
};

export const reservationManagementTableHeaders = ["Name", "Ticket Type", "Purchase Date", "Status"];