import { ApexOptions } from "apexcharts";

export const donutChartOptions: ApexOptions = {
  chart: {
    type: 'donut', // Explicitly specify the type as 'donut'
  },
  labels: ["Attendee Engagement", "Remaining"],
  colors: ["#2395D4"],
   tooltip: {
    y: {
      formatter: (val: number) => `${val}%` 
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: "60%",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
};

export const chartOptions: ApexOptions = {
  chart: { type: "line", toolbar: { show: false } },
  xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
  stroke: { curve: "smooth" },
  legend: { show: false },
  yaxis: { labels: { show: false } },
};

export const chartrevenuOptions: ApexOptions = {
  chart: {
    type: "line",
    toolbar: { show: false },
  },
  xaxis: {
    categories: ["April", "May", "June", "July", "August", "September", "October", "November"],
  },
  yaxis: {
    labels: {
      formatter: (value: any) => `${value / 1000}K XAF`,
    },
  },
  tooltip: {
    y: {
      formatter: (val: any) => `${val.toLocaleString()} XAF`,
    },
  },
  stroke: { curve: "smooth", width: 3 },
  colors: ["#2196f3"],
};

export const chartrevenuSeries = [
  {
    name: "Sales",
    data: [200000, 400000, 600000, 900000, 700000, 500000, 600000, 800000],
  },
];

// Define this somewhere in your code (probably in a separate constants file)
export const donutBestSellingChartOptions: ApexOptions = {
  chart: { type: "donut" },
  labels: ["VIP", "Standard", "Early Bird"],
  legend: { show: false }
};
export const donutBestSellingChartSeries = [45, 30, 25];


// Data for each ticket type
// 1. Define a type for your ticket types
export type TicketType = 'vip' | 'standard' | 'earlybird';

// 2. Define the shape of your ticket data
interface TicketData {
  series: number[];
  options: ApexOptions;
}

// 3. Define props interface
interface BestSellingProps {
  selectedTicket: TicketType;
  setSelectedTicket: (value: TicketType) => void;
  chartOptions: ApexOptions;
}
export const ticketData: Record<TicketType, TicketData> = {
  vip: {
    series: [45, 30, 25],
    options: {
      ...donutBestSellingChartOptions,
      colors: ["#2196F3", "#B0BEC5", "#424242"]
    }
  },
  standard: {
    series: [30, 50, 20],
    options: {
      ...donutBestSellingChartOptions,
      colors: ["#B0BEC5", "#2196F3", "#424242"]
    }
  },
  earlybird: {
    series: [25, 35, 40],
    options: {
      ...donutBestSellingChartOptions,
      colors: ["#424242", "#B0BEC5", "#2196F3"]
    }
  }
};


interface EventData {
  type: string;
  color: string;
}

export const eventsDate: Record<string, EventData> = {
  "2024-03-27": { type: "event", color: "#007bff" }, // Blue event
  "2024-03-16": { type: "highlight", color: "#001f3f" }, // Dark event
};

export type TicketTypes = 'VIP' | 'Standard' | 'EarlyBird' | 'Group' | 'Student';
export type TimePeriod = 'daily' | 'weekly' | 'monthly';

export interface ChartData {
  series: { name: string; data: number[] }[];
  options: ApexOptions;
}

export const ticketSalesData: Record<TicketTypes, Record<TimePeriod, number[]>> = {
  VIP: {
    daily: [50, 60, 70, 65, 75, 80, 90],
    weekly: [350, 420, 490, 455, 525, 560, 630],
    monthly: [1500, 1800, 2100, 1950, 2250, 2400, 2700]
  },
  Standard: {
    daily: [100, 120, 110, 105, 115, 125, 130],
    weekly: [700, 840, 770, 735, 805, 875, 910],
    monthly: [3000, 3600, 3300, 3150, 3450, 3750, 3900]
  },
  EarlyBird: {
    daily: [80, 90, 85, 95, 100, 110, 120],
    weekly: [560, 630, 595, 665, 700, 770, 840],
    monthly: [2400, 2700, 2550, 2850, 3000, 3300, 3600]
  },
  Group: {
    daily: [30, 40, 35, 45, 50, 55, 60],
    weekly: [210, 280, 245, 315, 350, 385, 420],
    monthly: [900, 1200, 1050, 1350, 1500, 1650, 1800]
  },
  Student: {
    daily: [60, 70, 65, 75, 80, 85, 90],
    weekly: [420, 490, 455, 525, 560, 595, 630],
    monthly: [1800, 2100, 1950, 2250, 2400, 2550, 2700]
  }
};