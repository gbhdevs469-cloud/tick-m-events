import { Box, Button, Checkbox, FormControlLabel, Typography, FormControl, Radio, RadioGroup } from "@mui/material";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { AppDispatch } from 'src/redux/store';
import { TicketReservationManagementTable } from "src/components/tables/ticket-reservation-management-table";
import { getUniqueFileName } from "src/hooks/download_unique_name";
import { useCSVExport, useExcelExport } from "src/hooks/downloadable";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { validateViewUpdate } from "../../redux/actions/event.action";
import { chartRealTimeOptions, ListViewMethod, reservationManagementTableHeaders, ValidationOptions } from "./utills";


export function ReservationManagement({ orderList }: any) {

    const { order, validationOptions: initialValidationOptions } = orderList
    const dispatch = useDispatch<AppDispatch>();
    const exportToExcel = useExcelExport();
    const exportToCSV = useCSVExport();
    // Initialize state with either the existing options or defaults
    const [validationOption, setValidationOption] = useState<ValidationOptions>(
        initialValidationOptions || {
            selectedView: 'scan',
            listViewMethods: []
        }
    );
    const [isModified, setIsModified] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as 'scan' | 'list' | 'both';
        setValidationOption(prev => ({
            ...prev,
            selectedView: value,
            // Clear list methods when switching to scan view
            ...(value === 'scan' ? { listViewMethods: [] } : {}),
            ...(value === 'both' ? { listViewMethods: ['manualCode', 'nameList', 'accountId'] } : {})
        }));
        setIsModified(true);
        setError(null); // Clear error when view changes
    };

    // Reset form when initialValidationOptions changes
    useEffect(() => {
        if (initialValidationOptions) {  // Remove .validationOptions here
            setValidationOption(initialValidationOptions);
            setIsModified(false);
        }
    }, [initialValidationOptions]);

    const handleListViewMethodChange = (method: ListViewMethod) => {
        setValidationOption(prev => {
            const methods = prev.listViewMethods.includes(method)
                ? prev.listViewMethods.filter(m => m !== method)
                : [...prev.listViewMethods, method];

            return {
                ...prev,
                listViewMethods: methods
            };
        });
        setIsModified(true);
        setError(null); // Clear error when method changes
    };

    const handleSaveValidationChanges = async () => {
        if (!orderList?._id) return;

        // Validate that at least one method is selected in list view
        if (validationOption.selectedView === 'list' && validationOption.listViewMethods.length === 0) {
            setError('Please select at least one validation method for List View');
            return;
        }

        try {
            await dispatch(validateViewUpdate(orderList._id, validationOption));
            toast.success("Changes Saved...");
            setIsModified(false);
            setError(null);
        } catch (errors) {
            toast.error("Failed to update validation settings");
        }
    };

    // Enable save button when:
    // 1. Scan view is selected (default has isModified true)
    // 2. Or list view is selected with at least one method
    const isSaveEnabled = isModified &&
        (
            validationOption.selectedView === 'scan' || validationOption.selectedView === 'both' ||
            (validationOption.selectedView === 'list' && validationOption.listViewMethods.length > 0)
        );

    const transformDataForExport = (orders: any[]) =>
        orders.map(
            item => ({
                name: item.userId.name,
                email: item.userId.email,
                createdAt: item.createdAt,
                paymentStatus: item.paymentStatus,
                ticketType: item.tickets.map((t: any) => t.ticketType).join(' | '),
            })
        );
    const handleExcelExport = () => {
        const exportData = transformDataForExport(order);
        exportToExcel(exportData, {
            fileName: getUniqueFileName('reservation_management_table'),
            sheetName: 'Reservation Entry List'
        });
    };

    const handleCSVExport = () => {
        const exportData = transformDataForExport(order);
        exportToCSV(exportData, {
            fileName: getUniqueFileName('reservation_management_table'),
            headers: ['Name', 'Email', 'Purchase Date', 'Payment Status', 'Ticket Type'],
            fieldNames: ['name', 'email', 'createdAt', 'paymentStatus', 'ticketType']
        });
    };

    const stats = getTicketStats(orderList);

    const chartOptions = {
        ...chartRealTimeOptions,
        series: [stats.sold, stats.validated, stats.remaining],
    }
    return (
        <Box mt={3} boxShadow={3} borderRadius={3} p={3} bgcolor="white">
            <HeadingCommon
                baseSize="33px"
                weight={600}
                variant="h5"
                title="Reservation Management"
                color="#0B2E4E"
            />
            {/* Table */}
            <TicketReservationManagementTable data={order} headers={reservationManagementTableHeaders} type="3" />

            {/* Export Buttons */}
            {
                order.length > 0 ? <Box mt={2} display="flex" gap={2}>
                    <Button onClick={handleCSVExport}
                        variant="contained" sx={{ bgcolor: "#0B2E4C", color: "white" }}>
                        Export as CSV
                    </Button>
                    <Button onClick={handleExcelExport} variant="contained" sx={{ bgcolor: "#0B2E4C", color: "white" }}>
                        Export as Excel
                    </Button>
                </Box> : null
            }

            {/* Ticket Validation Section */}
            <Box mt={3}>
                <HeadingCommon
                    baseSize="30px"
                    weight={600}
                    variant="h5"
                    title="Ticket Validation"
                    color="#0B2E4E"
                />
                <form>
                    <FormControl component="fieldset">
                        <RadioGroup
                            value={validationOption.selectedView}
                            onChange={handleViewChange}
                        >
                            {/* Scan View Option */}
                            <FormControlLabel
                                value="scan"
                                control={<Radio />}
                                label={
                                    <Box>
                                        <Typography>Scan View</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Validation via QR Code Scan
                                        </Typography>
                                    </Box>
                                }
                            />

                            {/* List View Option */}
                            <FormControlLabel
                                value="list"
                                control={<Radio />}
                                label="List View"
                            />
                            {validationOption.selectedView === 'list' && (
                                <Box ml={4} display="flex" flexDirection="column" gap={1}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={validationOption.listViewMethods.includes('manualCode')}
                                                onChange={() => handleListViewMethodChange('manualCode')}
                                            />
                                        }
                                        label="Manual Entry of Unique Code"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={validationOption.listViewMethods.includes('nameList')}
                                                onChange={() => handleListViewMethodChange('nameList')}
                                            />
                                        }
                                        label="Validation via Name List"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={validationOption.listViewMethods.includes('accountId')}
                                                onChange={() => handleListViewMethodChange('accountId')}
                                            />
                                        }
                                        label="Validation via Account ID"
                                    />
                                </Box>
                            )}
                            {/* List View Option */}
                            <FormControlLabel
                                value="both"
                                control={<Radio />}
                                label="Both scan and list view"
                            />
                        </RadioGroup>

                        {/* List View Sub-options (only visible if listView is selected) */}


                        {error && (
                            <Typography color="error" variant="body2" mt={1}>
                                {error}
                            </Typography>
                        )}

                        <Box display="flex" gap={2} mt={2}>
                            <Button
                                onClick={handleSaveValidationChanges}
                                variant="contained"
                                sx={{
                                    bgcolor: isSaveEnabled ? "#0B2E4C" : "grey.500",
                                    color: "white",
                                    cursor: isSaveEnabled ? 'pointer' : 'not-allowed'
                                }}
                                disabled={!isSaveEnabled}
                            >
                                Save Changes
                            </Button>

                            <Link to='/entry-validation'>
                                <Button variant="contained" sx={{ bgcolor: "#0B2E4C", color: "white" }}>
                                    Go to Ticket Validation Page
                                </Button>
                            </Link>
                        </Box>
                    </FormControl>
                </form>
            </Box>

            {/* Real-time Entry Statistics */}
            <Box
                mt={4}
                p={3}
                borderRadius={3}
                sx={{
                    background: "linear-gradient(to right, #ffffff 82%, #2395D4 82%)",
                    boxShadow: 3,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                {/* Left Side: Title */}
                <Box flex={1} minWidth="250px">
                    <Typography variant="h6" fontWeight={500} color="#002E4E" fontSize={{ xs: 20, sm: 25, md: 43 }}>
                        Real-time Entry Statistics
                    </Typography>
                </Box>

                {/* Center: Chart */}
                <Box flex={2} minWidth="300px">
                    <Chart options={chartOptions} series={chartOptions.series as number[]} type="donut" width="100%" height={250} />
                </Box>
            </Box>
        </Box>
    )
}

function getTicketStats(orderList: any) {
    const totalCapacity = Number(orderList?.ticketQuantity || 0);

    const ticketsSold = orderList?.order?.length || 0;
    const validated = orderList?.order?.filter(
        (o: any) => o?.entryStatus === "validated"
    ).length || 0;

    const remaining = Math.max(totalCapacity - ticketsSold, 0);

    return {
        sold: ticketsSold,
        validated,
        remaining,
    };
}