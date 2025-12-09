import React from "react";
import { Box, Card, Grid, Typography, useTheme, useMediaQuery } from "@mui/material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type MainChartComponentsProps = {
  selectedEvent: any;
}

const TicketSalesChartOptions: ApexOptions = {
  chart: {
    type: "pie",
    animations: { enabled: false } // Improves performance on resize
  },
  labels: [
    "Browsing TICK-M EVENTS",
    "Social Media Shares",
    "Push/Email Notifications",
    "Official Website",
    "Word of Mouth",
    "Paid Ads",
  ],
  colors: ["#4CAF50", "#E53935", "#FFC107", "#9575CD", "#F06292", "#FF7043"],
  responsive: [{
    breakpoint: 600,
    options: {
      legend: {
        position: "bottom",
        horizontalAlign: "center"
      }
    }
  }]
};

const GenderChartOptions: ApexOptions = {
  chart: {
    type: "pie",
    animations: { enabled: false }
  },
  labels: ["Male", "Female"],
  colors: ["#4CAF50", "#FFC107"],
  dataLabels: { enabled: true, style: { fontSize: "16px" } },
  responsive: [{
    breakpoint: 600,
    options: {
      legend: {
        position: "bottom"
      },
      dataLabels: {
        style: {
          fontSize: "12px"
        }
      }
    }
  }]
};


// const ageGroupsOptions: ApexOptions = {
//   chart: {
//     type: "bar",
//     animations: { enabled: false }
//   },
//   plotOptions: { bar: { columnWidth: "50%" } },
//   dataLabels: { enabled: false },
//   xaxis: {
//     categories: ["Youth (17-24)", "Adults (25-50)", "Seniors (50+)"],
//     labels: {
//       style: {
//         fontSize: '12px'
//       }
//     }
//   },
//   yaxis: {
//     labels: {
//       style: {
//         fontSize: '12px'
//       }
//     }
//   },
//   colors: ["#1976D2"],
//   responsive: [{
//     breakpoint: 600,
//     options: {
//       plotOptions: {
//         bar: {
//           columnWidth: '60%'
//         }
//       }
//     }
//   }]
// };

const ageGroupsOptions: ApexOptions = {
  chart: {
    type: "bar",
    animations: { enabled: false }
  },
  plotOptions: { bar: { columnWidth: "50%" } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Youth (17-24)", "Adults (25-50)", "Seniors (50+)"],
    labels: {
      style: {
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    min: 0,
    max: 90, // Adjust this if your expected data exceeds 90
    tickAmount: 6, // Divides Y-axis into 6 segments: 0, 15, 30, ..., 90
    labels: {
      style: {
        fontSize: '12px'
      }
    }
  },
  colors: ["#1976D2"],
  responsive: [{
    breakpoint: 600,
    options: {
      plotOptions: {
        bar: {
          columnWidth: '60%'
        }
      }
    }
  }]
};

const deviceUsageOptions: ApexOptions = {
  chart: {
    type: "pie",
    animations: { enabled: false }
  },
  labels: ["Smartphones", "Tablets", "Laptops", "Desktops"],
  colors: ["#4CAF50", "#E53935", "#FFC107", "#1976D2"],
  responsive: [{
    breakpoint: 600,
    options: {
      legend: {
        position: "bottom"
      }
    }
  }]
};

const clickRatesOptions: ApexOptions = {
  chart: {
    type: "pie",
    animations: { enabled: false }
  },
  labels: ["Clicked", "Purchased"],
  colors: ["#4CAF50", "#FFC107"],
  responsive: [{
    breakpoint: 600,
    options: {
      legend: {
        position: "bottom"
      }
    }
  }]
};

const clickRatesSeries = [3000, 2000];

interface ChartCardProps {
  title: string;
  options: ApexOptions;
  series: any;
  type: "pie" | "bar" | "line" | "area" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "treemap";
}

const ChartCard: React.FC<ChartCardProps> = ({ title, options, series, type }) => {
  const isEmptyData = Array.isArray(series) && series.every((value) => value === 0);
  const isGenderChart = title.toLowerCase().includes("gender");

  return (
    <Grid item xs={12} sm={6} md={6}>
      <Card
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          borderRadius: 3,
          boxShadow: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            mb: 2,
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
          }}
        >
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1, minHeight: 300, position: "relative" }}>
          {isEmptyData ? (
            <>
              <Chart
                options={{
                  ...options,
                  chart: { ...options.chart, type: "donut" },
                  labels: isGenderChart ? ["Male", "Female"] : ["No data"],
                  colors: isGenderChart ? ["#4CAF50", "#FFC107"] : ["#B0BEC5"],
                  legend: { show: true },
                  dataLabels: { enabled: false },
                }}
                series={isGenderChart ? [0, 0] : [1]}
                type="donut"
                height="100%"
                width="100%"
              />

              {/* Centered overlay message */}
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  color: "text.secondary"
                }}
              >
                No data available (0%)
              </Typography>
            </>
          ) : (
            <Chart options={options} series={series} type={type} height="100%" width="100%" />
          )}
        </Box>
      </Card>
    </Grid>
  );
};


export function MainChartComponents({ selectedEvent }: MainChartComponentsProps) {
  let maleCount = 0;
  let femaleCount = 0;
  selectedEvent.order.forEach((order: any) => {
    if (order.participantDetails && order.participantDetails.length > 0) {
      order.participantDetails.forEach((participant: any) => {
        if (participant.gender.toLowerCase() === "male") maleCount += 1;
        else if (participant.gender.toLowerCase() === "female") femaleCount += 1;
      });
    } else {
      // If participantDetails is empty or undefined, fallback if you have user gender info
      // Here we skip since no gender info is available
    }
  });
  const GenderChartSeries = [maleCount, femaleCount];

  // ----------------- Age Groups -----------------
  let youthCount = 0;
  let adultCount = 0;
  let seniorCount = 0;

  selectedEvent.order.forEach((order: any) => {
    order.participantDetails?.forEach((participant: any) => {
      const age = parseInt(participant.age, 10);
      if (!Number.isNaN(age)) {
        if (age >= 17 && age <= 24) {
          youthCount += 1;
        } else if (age >= 25 && age <= 50) {
          adultCount += 1;
        } else if (age > 50) {
          seniorCount += 1;
        }
      }
    });
  });

  const ageGroupsSeries = [{ data: [youthCount, adultCount, seniorCount] }];

  // ----------------- Device Usage -----------------
  let smartphones = 0;
  let tablets = 0;
  let laptops = 0;
  let desktops = 0;

  selectedEvent.order.forEach((order: any) => {
    switch (order.deviceUsed?.toLowerCase()) {
      case "smartphones":
      case "smartphone":
        smartphones += 1;
        break;
      case "tablets":
      case "tablet":
        tablets += 1;
        break;
      case "laptops":
      case "laptop":
        laptops += 1;
        break;
      case "desktops":
      case "desktop":
        desktops += 1;
        break;
      default:
        break; // no device info
    }
  });

  const deviceUsageSeries = [smartphones, tablets, laptops, desktops];

  // ----------------- Geographical Distribution (Dynamic) -----------------

  const geoDisplayOrder = ["USA", "UK", "Germany", "France", "India", "Cameroon"];

  const countryAliasMap: Record<string, string> = {
    "united states": "USA",
    "united kingdom": "UK",
    "india": "India",
    "germany": "Germany",
    "france": "France",
    "cameroon": "Cameroon"
  };

  const geoCounts: Record<string, number> = {};

  // Count orders per mapped country
  selectedEvent.order.forEach((order: any) => {
    const rawCountry = order.orderAddress?.country?.toLowerCase()?.trim();

    if (rawCountry) {
      const mappedCountry = countryAliasMap[rawCountry] || rawCountry;
      geoCounts[mappedCountry] = (geoCounts[mappedCountry] || 0) + 1;
    }
  });

  const geoData = geoDisplayOrder.map(country => geoCounts[country] || 0);

  const geographicalDistributionOptions: ApexOptions = {
    chart: {
      type: "bar",
      animations: { enabled: false }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: geoDisplayOrder, // fixed full list
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    colors: ["#1976D2"],
    responsive: [{
      breakpoint: 600,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '60%'
          }
        }
      }
    }]
  };
  const geographicalDistributionSeries = [{ name: "Regional Statistics", data: geoData }];


  // ----------------- Ticket Sales Distribution (Dynamic) -----------------
  const salesLabels = [
    "Browsing TICK-M EVENTS",
    "Social Media Shares",
    "Push/Email Notifications",
    "Official Website",
    "Word of Mouth",
    "Paid Ads"
  ];

  const salesCounts: Record<string, number> = {};
  salesLabels.forEach(label => {
    salesCounts[label] = 0;
  });

  selectedEvent.order.forEach((order: any) => {
    const source = order.orderAddress?.hearAboutEvent;
    if (salesLabels.includes(source)) {
      salesCounts[source] += 1;
    }
  });

  const TicketSalesChartSeries = salesLabels.map(label => salesCounts[label]);


  const chartData = [
    { title: "Ticket Sales Distribution", options: TicketSalesChartOptions, series: TicketSalesChartSeries, type: "pie" as const },
    { title: "Gender Breakdown", options: GenderChartOptions, series: GenderChartSeries, type: "pie" as const },
    { title: "Geographical Distribution", options: geographicalDistributionOptions, series: geographicalDistributionSeries, type: "bar" as const },
    { title: "Device Usage", options: deviceUsageOptions, series: deviceUsageSeries, type: "pie" as const },
    { title: "Age Groups", options: ageGroupsOptions, series: ageGroupsSeries, type: "bar" as const },
    // { title: "Email & Notification Click Rates", options: clickRatesOptions, series: clickRatesSeries, type: "pie" as const },
  ];

  return (
    <Box mt={3}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {chartData?.map((chart, index) => (
          <ChartCard key={index} {...chart} />
        ))}
      </Grid>
    </Box>
  );
}