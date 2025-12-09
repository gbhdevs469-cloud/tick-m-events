import React from 'react';
import Chart from 'react-apexcharts';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { ApexOptions } from "apexcharts";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

// Default data for fallback
const defaultBarGraphData = {
  labels: [
    "DJ & Entertainment",
    "Catering Service",
    "Photography & Video",
    "Venue Rental",
    "Hosts & Presenters"
  ],
  datasets: [
    {
      label: "Number of Services",
      data: [35, 28, 22, 17, 9],
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF"
      ]
    }
  ]
};

const defaultSummary = {
  totalServices: 5,
  totalCategories: 5,
  mostPopularCategory: "DJ & Entertainment"
};

interface PerformanceSummaryProps {
  barGraphData?: any;
  rawData?: any[];
  summary?: any;
}

export function PerformanceSummary({ 
  barGraphData, 
  rawData, 
  summary 
}: PerformanceSummaryProps) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 900px - 1200px
  const isLg = useMediaQuery(theme.breakpoints.up('lg')); // > 1200px

  // Use provided data or fall back to defaults
  const graphData = barGraphData || defaultBarGraphData;
  const summaryData = summary || defaultSummary;
  const servicesData = rawData || [];

  // Extract categories and data for the chart
  const categories = graphData.labels || [];
  const chartData = graphData.datasets?.[0]?.data || [];
  const backgroundColors = graphData.datasets?.[0]?.backgroundColor || ['#2196f3'];

  // Responsive chart height
  const getChartHeight = () => {
    if (isXs) return 300;
    if (isSm) return 350;
    if (isMd) return 400;
    return 450;
  };

  // Responsive font sizes
  const getTitleFontSize = () => {
    if (isXs) return '14px';
    if (isSm) return '16px';
    return '18px';
  };

  const getLabelFontSize = () => {
    if (isXs) return '9px';
    if (isSm) return '10px';
    return '12px';
  };

  const getColumnWidth = () => {
    if (isXs) return '35%';
    if (isSm) return '45%';
    if (isMd) return '50%';
    return '60%';
  };

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { 
        show: !isXs // Hide toolbar on mobile for more space
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
      fontFamily: theme.typography.fontFamily,
    },
    title: {
      text: 'Most Popular Services',
      align: 'center',
      style: {
        fontSize: getTitleFontSize(),
        fontWeight: 600,
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
      },
      offsetY: isXs ? 0 : 10,
    },
    xaxis: {
      categories,
      labels: {
        rotate: isXs ? -45 : categories.length > 3 ? -15 : 0,
        style: {
          fontSize: getLabelFontSize(),
          colors: theme.palette.text.secondary,
          fontFamily: theme.typography.fontFamily,
        },
        trim: true,
        hideOverlappingLabels: true,
        maxHeight: isXs ? 60 : 80,
      },
      axisTicks: {
        show: !isXs,
      },
      axisBorder: {
        show: !isXs,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: getLabelFontSize(),
          colors: theme.palette.text.secondary,
          fontFamily: theme.typography.fontFamily,
        }
      },
      title: {
        text: 'Number of Services',
        style: {
          fontSize: getLabelFontSize(),
          color: theme.palette.text.secondary,
          fontFamily: theme.typography.fontFamily,
        },
        offsetX: isXs ? -10 : 0,
      },
      tickAmount: isXs ? 3 : 5,
    },
    colors: backgroundColors,
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        columnWidth: getColumnWidth(),
        distributed: true,
        borderRadius: isXs ? 2 : 4,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top',
          orientation: isXs ? 'vertical' : 'horizontal',
        },
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: isXs ? 2 : 4,
      xaxis: {
        lines: {
          show: false,
        }
      },
      yaxis: {
        lines: {
          show: true,
        }
      },
      padding: {
        top: isXs ? -20 : 0,
        right: isXs ? 0 : 10,
        bottom: isXs ? 0 : 10,
        left: isXs ? -10 : 0,
      },
    },
    tooltip: {
      theme: theme.palette.mode,
      style: {
        fontSize: getLabelFontSize(),
        fontFamily: theme.typography.fontFamily,
      },
      y: {
        formatter(val: number) {
          return `${val} service${val !== 1 ? 's' : ''}`;
        }
      }
    },
    legend: {
      position: isXs ? 'bottom' : 'top',
      horizontalAlign: 'center',
      fontSize: getLabelFontSize(),
      fontFamily: theme.typography.fontFamily,
      offsetY: isXs ? -10 : 0,
      itemMargin: {
        horizontal: isXs ? 8 : 16,
        vertical: isXs ? 4 : 8,
      },
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xs, // 0px
        options: {
          chart: {
            height: 280,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              columnWidth: '30%',
              borderRadius: 2,
              dataLabels: {
                position: 'top',
              },
            },
          },
          xaxis: {
            labels: {
              rotate: -45,
              style: {
                fontSize: '8px',
              },
              maxHeight: 50,
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '8px',
              },
            },
            tickAmount: 3,
          },
          legend: {
            position: 'bottom',
            offsetY: -5,
            fontSize: '10px',
          },
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm, // 600px
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            bar: {
              columnWidth: '40%',
            },
          },
          xaxis: {
            labels: {
              rotate: -30,
              style: {
                fontSize: '9px',
              },
            },
          },
          yaxis: {
            tickAmount: 4,
          },
        },
      },
      {
        breakpoint: theme.breakpoints.values.md, // 900px
        options: {
          chart: {
            height: 380,
          },
          plotOptions: {
            bar: {
              columnWidth: '50%',
            },
          },
          xaxis: {
            labels: {
              rotate: -15,
            },
          },
        },
      },
    ],
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.9,
        }
      }
    }
  };

  const chartSeries = [{
    name: graphData.datasets?.[0]?.label || 'Number of Services',
    data: chartData
  }];

  return (
    <Box sx={{ p: isXs ? 1 : 2 }}>
      <HeadingCommon 
        title="Monitoring Event Market Trends" 
        width={600} 
        baseSize={isXs ? "18px" : isSm ? "20px" : "22px"} 
      />
      <HeadingCommon 
        title="Analysis of the most requested services and marketplace trends." 
        baseSize={isXs ? "12px" : isSm ? "14px" : "16px"} 
      />
      
      {/* Summary Statistics - Responsive layout */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: isXs ? 1 : 2, 
          mb: 3, 
          flexWrap: 'wrap',
          justifyContent: isXs ? 'space-between' : 'center',
          flexDirection: isXs ? 'row' : 'row',
        }}
      >
        <Box 
          sx={{ 
            p: isXs ? 1 : 2, 
            borderRadius: 2, 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            minWidth: isXs ? 80 : 120,
            flex: isXs ? 1 : 'none',
            textAlign: 'center',
            mx: isXs ? 0.5 : 0,
          }}
        >
          <Typography variant={isXs ? "body2" : "h6"} fontWeight="bold">
            {summaryData.totalServices}
          </Typography>
          <Typography variant={isXs ? "caption" : "body2"}>
            Total Services
          </Typography>
        </Box>
        <Box 
          sx={{ 
            p: isXs ? 1 : 2, 
            borderRadius: 2, 
            bgcolor: 'secondary.light', 
            color: 'secondary.contrastText',
            minWidth: isXs ? 80 : 120,
            flex: isXs ? 1 : 'none',
            textAlign: 'center',
            mx: isXs ? 0.5 : 0,
          }}
        >
          <Typography variant={isXs ? "body2" : "h6"} fontWeight="bold">
            {summaryData.totalCategories}
          </Typography>
          <Typography variant={isXs ? "caption" : "body2"}>
            Categories
          </Typography>
        </Box>
        <Box 
          sx={{ 
            p: isXs ? 1 : 2, 
            borderRadius: 2, 
            bgcolor: 'success.light', 
            color: 'success.contrastText',
            minWidth: isXs ? 100 : 140,
            flex: isXs ? '1 0 100%' : 'none',
            textAlign: 'center',
            mt: isXs ? 1 : 0,
            mx: isXs ? 0.5 : 0,
          }}
        >
          <Typography 
            variant={isXs ? "body2" : "h6"} 
            fontWeight="bold"
            sx={{ 
              fontSize: isXs ? '12px' : 'inherit',
              lineHeight: isXs ? 1.2 : 'inherit',
            }}
          >
            {summaryData.mostPopularCategory}
          </Typography>
          <Typography variant={isXs ? "caption" : "body2"}>
            Most Popular
          </Typography>
        </Box>
      </Box>

      {/* Chart Container */}
      <Box 
        sx={{ 
          position: 'relative',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: isXs ? 1 : 2,
          bgcolor: theme.palette.background.paper,
          overflow: 'hidden',
        }}
      >
        {chartData.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={getChartHeight()}
          />
        ) : (
          <Box 
            sx={{ 
              height: getChartHeight(), 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
            }}
          >
            <Typography 
              variant={isXs ? "body1" : "h6"} 
              color="text.secondary"
              textAlign="center"
            >
              No data available
            </Typography>
          </Box>
        )}
      </Box>

      {/* Raw Data Summary */}
      {servicesData.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography 
            variant={isXs ? "h6" : "h5"} 
            gutterBottom
            sx={{ fontSize: isXs ? '16px' : 'inherit' }}
          >
            Service Details
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {servicesData.map((categoryGroup: any, index: number) => (
              <Box 
                key={index}
                sx={{ 
                  p: isXs ? 1 : 2, 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  bgcolor: theme.palette.background.default
                }}
              >
                <Typography 
                  variant={isXs ? "body2" : "subtitle1"} 
                  fontWeight="bold"
                  sx={{ fontSize: isXs ? '12px' : 'inherit' }}
                >
                  {categoryGroup.category} ({categoryGroup.count} services)
                </Typography>
                {categoryGroup.services.map((service: any) => (
                  <Box 
                    key={service._id}
                    sx={{ 
                      display: 'flex', 
                      flexDirection: isXs ? 'column' : 'row',
                      justifyContent: isXs ? 'flex-start' : 'space-between',
                      gap: isXs ? 0.5 : 1,
                      mt: 1,
                      p: 1,
                      bgcolor: theme.palette.background.paper,
                      borderRadius: 1
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ fontSize: isXs ? '11px' : 'inherit' }}
                    >
                      Location: {service.eventLocation}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ fontSize: isXs ? '11px' : 'inherit' }}
                    >
                      Budget: {service.budget}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}