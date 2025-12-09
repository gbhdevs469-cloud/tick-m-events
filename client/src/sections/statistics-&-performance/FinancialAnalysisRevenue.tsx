import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from '@mui/material';
import * as XLSX from 'xlsx';

type MonthlyBreakdown = {
  year: number;
  month: number;
  monthName: string;
  period: string;
  revenueEarned: number;
  servicesCompleted: number;
  averagePayment: number;
  bidRevenue: number;
  eventReqRevenue: number;
  bidServices: number;
  eventReqServices: number;
};

type FinancialAnalytics = {
  monthlyBreakdown: MonthlyBreakdown[];
};

type RevenueItem = {
  Period: string;
  Revenue: string;
  Services: string;
  Average: string;
  OriginalData: MonthlyBreakdown;
};

const TIME_FILTER_OPTIONS = [
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last 1 Week', value: '1w' },
  { label: 'Last 1 Month', value: '1m' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last 12 Months', value: '12m' },
  { label: 'Custom Range', value: 'custom' },
];

const MONTH_FILTER_OPTIONS = [
  { label: '1 Month', value: '1' },
  { label: '2 Months', value: '2' },
  { label: '3 Months', value: '3' },
  { label: '6 Months', value: '6' },
  { label: '9 Months', value: '9' },
  { label: '12 Months', value: '12' },
  { label: 'All Time', value: 'all' },
];

const YEAR_FILTER_OPTIONS = [
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: 'All Years', value: 'all' },
];

type FilterType = 'time' | 'months' | 'year';

export function FinancialAnalysisRevenue({ financialAnalytics }: { financialAnalytics: FinancialAnalytics }) {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('3m');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState('3');
  const [selectedYearFilter, setSelectedYearFilter] = useState('all');
  const [activeFilterType, setActiveFilterType] = useState<FilterType>('time');

  const handleTimeFilterChange = (event: SelectChangeEvent) => {
    setSelectedTimeFilter(event.target.value);
    setActiveFilterType('time');
  };

  const handleMonthFilterChange = (event: SelectChangeEvent) => {
    setSelectedMonthFilter(event.target.value);
    setActiveFilterType('months');
  };

  const handleYearFilterChange = (event: SelectChangeEvent) => {
    setSelectedYearFilter(event.target.value);
    setActiveFilterType('year');
  };

  // Transform the monthlyBreakdown data into RevenueItem format
  const transformedData: RevenueItem[] = useMemo(() => 
    financialAnalytics.monthlyBreakdown
      .filter(item => item.revenueEarned > 0 || item.servicesCompleted > 0)
      .map(item => ({
        Period: item.period,
        Revenue: item.revenueEarned.toLocaleString(),
        Services: item.servicesCompleted.toString(),
        Average: item.averagePayment.toLocaleString(),
        OriginalData: item
      }))
      .reverse()
  , [financialAnalytics.monthlyBreakdown]);

  // Get filtered data based on active filter type
  const filteredData = useMemo(() => {
    switch (activeFilterType) {
      case 'time':
        return filterByTimeRange(transformedData, selectedTimeFilter);
      case 'months':
        return filterByMonthCount(transformedData, selectedMonthFilter);
      case 'year':
        return filterByYear(transformedData, selectedYearFilter);
      default:
        return transformedData;
    }
  }, [transformedData, activeFilterType, selectedTimeFilter, selectedMonthFilter, selectedYearFilter]);

  // Get current active filter value for display
  const getActiveFilterLabel = () => {
    switch (activeFilterType) {
      case 'time':
        return TIME_FILTER_OPTIONS.find(opt => opt.value === selectedTimeFilter)?.label || 'Select Filter';
      case 'months':
        return MONTH_FILTER_OPTIONS.find(opt => opt.value === selectedMonthFilter)?.label || 'Select Filter';
      case 'year':
        return YEAR_FILTER_OPTIONS.find(opt => opt.value === selectedYearFilter)?.label || 'Select Filter';
      default:
        return 'Select Filter';
    }
  };

  return (
    <Paper
      sx={{
        mt: 3,
        p: { xs: 2, sm: 3 },
        borderRadius: 2.5,
        border: '1px solid #E0E0E0',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Financial Analysis & Revenue
      </Typography>

      {/* Filter Section */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={selectedTimeFilter}
            onChange={handleTimeFilterChange}
            label="Time Range"
          >
            {TIME_FILTER_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Month Count</InputLabel>
          <Select
            value={selectedMonthFilter}
            onChange={handleMonthFilterChange}
            label="Month Count"
          >
            {MONTH_FILTER_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYearFilter}
            onChange={handleYearFilterChange}
            label="Year"
          >
            {YEAR_FILTER_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: { sm: 2 }, color: 'text.secondary' }}>
          <Typography variant="body2">
            Active Filter: <strong>{getActiveFilterLabel()}</strong>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ overflowX: 'auto', borderRadius: 2 }}>
        <Box sx={{ minWidth: 700 }}>
          {/* Table Header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              backgroundColor: '#1976d2',
              color: 'white',
              alignItems: 'center',
              justifyItems: 'center',
              py: 1.5,
              px: 2,
              fontWeight: 600,
            }}
          >
            <Box>Period</Box>
            <Box>Revenue Earned (XAF)</Box>
            <Box>Services Completed</Box>
            <Box>Average Payment (XAF)</Box>
          </Box>

          {/* Table Body */}
          <Box
            sx={{
              maxHeight: 300,
              overflowY: 'auto',
              borderTop: '1px solid #ddd',
              '&::-webkit-scrollbar': {
                width: '2px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#0B2E4C',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#e0e0e0',
                borderRadius: '10px',
              },
            }}
          >
            {filteredData.length === 0 ? (
              <Box
                sx={{
                  py: 4,
                  textAlign: 'center',
                  fontStyle: 'italic',
                  color: 'gray',
                }}
              >
                No financial data available for the selected filter.
              </Box>
            ) : (
              filteredData.map((item: RevenueItem, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    alignItems: 'center',
                    justifyItems: 'center',
                    py: 1.5,
                    px: 2,
                    borderBottom:
                      idx !== filteredData.length - 1
                        ? '1px solid rgba(195, 195, 195, 1)'
                        : 'none',
                    backgroundColor: idx % 2 === 0 ? '#fafafa' : '#ffffff',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                >
                  <Box sx={{ fontWeight: 500 }}>{item.Period}</Box>
                  <Box sx={{ fontWeight: 600, color: '#2e7d32' }}>{item.Revenue}</Box>
                  <Box>{item.Services}</Box>
                  <Box sx={{ fontWeight: 500 }}>{item.Average}</Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>

      {/* Summary Stats */}
      {filteredData.length > 0 && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            Summary for {getActiveFilterLabel()}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                Total Revenue: <strong>{filteredData.reduce((sum, item) => sum + item.OriginalData.revenueEarned, 0).toLocaleString()} XAF</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                Total Services: <strong>{filteredData.reduce((sum, item) => sum + item.OriginalData.servicesCompleted, 0)}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                Average Revenue: <strong>{Math.round(filteredData.reduce((sum, item) => sum + item.OriginalData.revenueEarned, 0) / filteredData.length).toLocaleString()} XAF</strong>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Action Buttons */}
      <Grid
        container
        spacing={2}
        sx={{
          mt: { xs: 3, md: 3 },
        }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <StyledActionButton 
            onClick={() => handleDownload(filteredData, getActiveFilterLabel())}
            disabled={filteredData.length === 0}
          >
            Download Financial Report (CSV)
          </StyledActionButton>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StyledActionButton 
            onClick={() => handleExcelDownload(filteredData, getActiveFilterLabel())}
            disabled={filteredData.length === 0}
          >
            Download Financial Report (Excel)
          </StyledActionButton>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StyledActionButton 
            onClick={() => handleDetailedExcelDownload(filteredData, getActiveFilterLabel())}
            disabled={filteredData.length === 0}
          >
            Download Detailed Report (Excel)
          </StyledActionButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

function StyledActionButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      sx={{
        backgroundColor: disabled ? '#cccccc' : '#0B2E4C',
        color: 'white',
        borderRadius: '20px',
        px: 3,
        height: 45,
        textTransform: 'none',
        fontSize: '14px',
        '&:hover': {
          backgroundColor: disabled ? '#cccccc' : '#071E33',
        },
        width: '100%',
      }}
    >
      {children}
    </Button>
  );
}

// Filter functions
function filterByTimeRange(data: RevenueItem[], filter: string): RevenueItem[] {
  if (data.length === 0) return [];

  switch (filter) {
    case '24h':
      return data.slice(0, 1);
    case '1w':
      return data.slice(0, 1);
    case '1m':
      return data.slice(0, 1);
    case '3m':
      return data.slice(0, 3);
    case '6m':
      return data.slice(0, 6);
    case '12m':
      return data.slice(0, 12);
    case 'custom':
      return data;
    default:
      return data;
  }
}

function filterByMonthCount(data: RevenueItem[], months: string): RevenueItem[] {
  if (data.length === 0) return [];
  
  if (months === 'all') {
    return data;
  }
  
  const monthCount = parseInt(months, 10);
  return data.slice(0, monthCount);
}

function filterByYear(data: RevenueItem[], year: string): RevenueItem[] {
  if (data.length === 0) return [];
  
  if (year === 'all') {
    return data;
  }
  
  const yearNum = parseInt(year, 10);
  return data.filter(item => item.OriginalData.year === yearNum);
}

function handleDownload(data: RevenueItem[], filterLabel: string) {
  if (data.length === 0) return;

  const csvHeader = ['Period', 'Revenue Earned (XAF)', 'Services Completed', 'Average Payment (XAF)'].join(',');
  
  const csvRows = data.map(item =>
    [
      `"${item.Period}"`,
      `"${item.Revenue}"`,
      `"${item.Services}"`,
      `"${item.Average}"`
    ].join(',')
  );

  const csvContent = [csvHeader, ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const downloadLink = document.createElement('a');
  const fileName = `financial-report-${filterLabel.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;

  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.setAttribute('download', fileName);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function handleExcelDownload(data: RevenueItem[], filterLabel: string) {
  if (data.length === 0) return;

  const worksheetData = data.map(item => ({
    'Period': item.Period,
    'Revenue Earned (XAF)': item.Revenue,
    'Services Completed': item.Services,
    'Average Payment (XAF)': item.Average,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Financial Report');

  const fileName = `financial-report-${filterLabel.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

function handleDetailedExcelDownload(data: RevenueItem[], filterLabel: string) {
  if (data.length === 0) return;

  const worksheetData = data.map(item => ({
    'Period': item.Period,
    'Revenue Earned (XAF)': item.OriginalData.revenueEarned,
    'Services Completed': item.OriginalData.servicesCompleted,
    'Average Payment (XAF)': item.OriginalData.averagePayment,
    'Bid Revenue (XAF)': item.OriginalData.bidRevenue,
    'Event Request Revenue (XAF)': item.OriginalData.eventReqRevenue,
    'Bid Services': item.OriginalData.bidServices,
    'Event Request Services': item.OriginalData.eventReqServices,
    'Year': item.OriginalData.year,
    'Month': item.OriginalData.monthName,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Detailed Financial Report');

  // Add summary sheet
  const totalRevenue = data.reduce((sum, item) => sum + item.OriginalData.revenueEarned, 0);
  const totalServices = data.reduce((sum, item) => sum + item.OriginalData.servicesCompleted, 0);
  const avgRevenue = Math.round(totalRevenue / data.length);
  
  const summaryData = [
    ['Financial Summary Report', '', '', ''],
    ['Filter Applied:', filterLabel, '', ''],
    ['Report Date:', new Date().toLocaleDateString(), '', ''],
    ['', '', '', ''],
    ['Total Periods:', data.length, '', ''],
    ['Total Revenue (XAF):', totalRevenue, '', ''],
    ['Total Services:', totalServices, '', ''],
    ['Average Revenue (XAF):', avgRevenue, '', ''],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  const fileName = `detailed-financial-report-${filterLabel.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}