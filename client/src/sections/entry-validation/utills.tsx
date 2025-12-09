import { ApexOptions } from "apexcharts";

export type TicketStatus = 'ACCEPTED' | 'INVALID' | 'USED';

export interface Ticket {
    id: number;
    status: TicketStatus;
    message: string;
    time?: string;
    name?: string;
    email?: string;
    ticketType?: string;
}

export const TICKET_STATUS: Record<TicketStatus, { backgroundColor: string; color: string }> = {
    ACCEPTED: {
        backgroundColor: "#DFFFE0",
        color: "#4CAF50"
    },
    INVALID: {
        backgroundColor: "#FFCCCC",
        color: "#D32F2F"
    },
    USED: {
        backgroundColor: "#FFD9A3",
        color: "#FF9800"
    }
};

export const CHART_OPTIONS: ApexOptions = {
    chart: { type: "pie" },
    labels: ["Validated Tickets", "Pending Tickets", "Invalid Tickets"],
    legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "14px"
    },
    dataLabels: {
        enabled: true,
        formatter(val: number, opts: { w: any; seriesIndex: number }): string {
            return opts.w.globals.series[opts.seriesIndex];
        },
        style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#fff"]
        }
    },
    colors: ["#4CAF50", "#FFC107", "#D32F2F"],
    responsive: [
        {
            breakpoint: 600,
            options: {
                chart: { width: "100%" },
                legend: { fontSize: "12px" }
            }
        }
    ]
};

export const CHART_SERIES = [350, 150, 5];

export const STATS_DATA = [
    { label: "Total Tickets Sold", value: 500 },
    { label: "Validated Tickets", value: 350 },
    { label: "Pending Tickets", value: 150 },
    { label: "Invalid Tickets", value: 5 }
];



export const tickets: Ticket[] = [
    {
        id: 1,
        status: "ACCEPTED",
        message: "Access granted. Welcome! Entry Time: 14:30 PM ",
        name: "John Doe",
        email: "johndoe@example.com",
        ticketType: "VIP"
    },
    {
        id: 2,
        status: "INVALID",
        message: "Invalid ticket"
    },
    {
        id: 3,
        status: "USED",
        message: "Ticket already used"
    }
];

export const entries = [
    { name: "Jean M.", ticketType: "VIP", entryTime: "18:30", status: "Validated" }
];


export const entryValidationHeaders = ["Order Code", "Name", "Ticket Type", "Entry Time", "Status"]
