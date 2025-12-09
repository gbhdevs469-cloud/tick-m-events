import { ApexOptions } from "apexcharts";

export const commonChartOptions: Partial<ApexOptions> = {
    chart: {
        toolbar: { show: false },
        animations: { enabled: true },
        foreColor: "#2395D4",
        fontFamily: "inherit"
    },

};

export const barChartSeries = [{ name: "Performance", data: [30, 50, 20, 60, 50, 20, 30] }];

export const salesComparisonSeries = [
    { name: "White", data: [10, 20, 15, 30, 25, 10, 20, 30, 5, 25] },
    { name: "Black", data: [15, 10, 20, 25, 30, 15, 25, 10, 30, 20] },
];

export const downloadButtons = [
    { label: "Download PDF", color: "#0B2E4C" },
    { label: "Download Excel", color: "#1D8DCA" },
    { label: "Download CSV", color: "#868686" }
];