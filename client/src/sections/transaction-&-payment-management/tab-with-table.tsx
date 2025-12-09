import { Box, Button, Paper, Tab, Tabs, Typography, TextField, MenuItem, Select } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { AppDispatch, RootState } from 'src/redux/store';
import { MatrixThreeCard } from "src/components/matrix-three-cards/matrix-three-cards";
import { TransactionAndPaymentManagementTable } from "src/components/tables/transaction-&-payment-management-table";
import { metrics, paymentSettings, transactionsPaymentHistoryTableData, transactionsPaymentHistoryTableHeaders, bankingHeaders, mobileMoneyHeaders, cardHeaders } from "./utills";
import { RequestTabSection } from "./request-tab-section";
import { savePaymentSettings, getPaymentSettings, getPaymentSettingById, updatePaymentSetting } from "../../redux/actions/paymentSettingActions";
import { PaymentMethodForm } from "./PaymentMethodForm";

interface FormValues {
    currency: string;
    paymentMethod: string;
    fields: {
        [key: string]: string;
    };
}

interface PaymentDetails {
    accountHolder?: string;
    momoNumber?: string;
    iban?: string;
    swift?: string;
    cardDetails?: string;
    [key: string]: any;
}

interface PaymentSetting {
    _id?: string;
    paymentMethod: string;
    method: string;
    details: PaymentDetails;
}

const methodFields: Record<string, string[]> = {
    "Mobile Money (MTN MoMo, Orange Money)": ["Phone Number", "Provider"],
    "Bank Transfer": ["Account Holder Name", "Account Number", "Bank Name", "CIF Number"],
    "Credit/Debit Card (Visa/MasterCard)": ["Cardholder Name", "Card Number", "Expiry Date", "CVV"]
};
const methodValueToLabelMap: { [key: string]: string } = {
    mobile_money: "Mobile Money (MTN MoMo, Orange Money)",
    bank_transfer: "Bank Transfer",
    credit_card: "Credit/Debit Card (Visa/MasterCard)",
};

export function TabWithTableView() {
    const [tabValue, setTabValue] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const tabLabels = ["Transactions", "Payment Settings"];
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const { loading, error, success, withDrawalGateway } = useSelector((state: RootState) => state.paymentSettings);
    const { paymentSettingDetail } = useSelector((s: RootState) => s.paymentSettings);

    useEffect(() => {
        if (success) {
            toast.success("Payment settings saved successfully!");
            dispatch(getPaymentSettings()); // <-- Fetch updated list
            setFormValues({
                currency: "XAF",
                paymentMethod: "",
                fields: {}
            });
        }
        if (error) {
            console.log(`Error: ${error}`);
        }
    }, [success, error, dispatch]);

    useEffect(() => {
        dispatch(getPaymentSettings());
    }, [dispatch]);

    useEffect(() => {
        if (paymentSettingDetail && editingId) {
            const methodKey = methodValueToLabelMap[paymentSettingDetail.paymentMethod] || "";

            setFormValues({
                currency: "XAF",
                paymentMethod: methodKey,
                fields: paymentSettingDetail.details,
            });
        }
    }, [paymentSettingDetail, editingId]);

    const [formValues, setFormValues] = useState<FormValues>({
        currency: "XAF",
        paymentMethod: "",
        fields: {}
    });
    const [statusFilter, setStatusFilter] = useState("All");
    const [serviceFilter, setServiceFilter] = useState("All");

    // Get unique services for filter
    const uniqueServices = [...new Set(transactionsPaymentHistoryTableData.map(item => item.requestedService))];

    // Filter logic
    const filteredData = transactionsPaymentHistoryTableData.filter((item) => {
        const matchStatus = statusFilter === "All" || item.status === statusFilter;
        const matchService = serviceFilter === "All" || item.requestedService === serviceFilter;
        return matchStatus && matchService;
    });
   
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                }}
            >
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    TabIndicatorProps={{ style: { display: "none" } }}
                    sx={{
                        display: "flex",
                    }}
                >
                    {tabLabels.map((label, index) => (
                        <Tab
                            key={index}
                            label={label}
                            disableRipple
                            sx={{
                                px: 3,
                                mx: 1,
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: 500,
                                fontSize: "0.875rem",
                                color: tabValue === index ? "white !important" : "#0B2E4C", // white for active tab
                                backgroundColor: tabValue === index ? "#0B2E4C" : "transparent",
                                border: tabValue === index ? "none" : "1px solid #ccc",
                                transition: "all 0.3s ease",
                                minWidth: "fit-content",
                                whiteSpace: "nowrap",
                                "&:hover": {
                                    backgroundColor: tabValue === index ? "#002244" : "#f5f5f5",
                                },
                            }}
                        />
                    ))}
                </Tabs>
            </Box>
            <MatrixThreeCard metrics={metrics} />
            <Paper elevation={6}
                sx={{
                    mt: 2,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: "hidden",
                }}
            >
                {tabValue === 0 && (
                    <>
                        <Typography variant="h5" fontWeight={600} fontSize={{ xs: "18px", sm: "22px", md: "26px" }} gutterBottom>
                            Transactions & Payment History
                        </Typography>

                        {/* Dropdowns */}
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            {/* Contained style */}
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                displayEmpty
                                IconComponent={ExpandMoreRoundedIcon}
                                sx={{
                                    backgroundColor: "#0B2E4C",
                                    color: "white",
                                    fontWeight: 500,
                                    borderRadius: 3,
                                    height: "40px",
                                    width: "175px",
                                    fontSize: { xs: "11px", sm: "13px", md: "15px" },
                                    ".MuiOutlinedInput-notchedOutline": { border: "none" },
                                    "& .MuiSelect-icon": {
                                        color: "white",
                                        fontSize: "16px", // makes arrow bigger and bolder
                                        fontWeight: "500",
                                    },
                                }}
                            >
                                <MenuItem value="All" sx={{ fontSize: { xs: "11px", sm: "13px", md: "15px" } }}>Filter By Status</MenuItem>
                                <MenuItem value="Received" sx={{ fontSize: { xs: "11px", sm: "13px", md: "15px" } }}>Received</MenuItem>
                                <MenuItem value="Pending" sx={{ fontSize: { xs: "11px", sm: "13px", md: "15px" } }}>Pending</MenuItem>
                            </Select>

                            {/* Outlined style */}
                            <Select
                                value={serviceFilter}
                                onChange={(e) => setServiceFilter(e.target.value)}
                                displayEmpty
                                IconComponent={ExpandMoreRoundedIcon}
                                sx={{
                                    backgroundColor: "white",
                                    color: "#000",
                                    fontWeight: 500,
                                    borderRadius: 3,
                                    height: "40px",
                                    width: "175px",
                                    fontSize: { xs: "11px", sm: "13px", md: "15px" },
                                    ".MuiOutlinedInput-notchedOutline": { border: "1px solid #C0C0C0" },
                                    "& .MuiSelect-icon": {
                                        color: "#000",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                    },
                                }}
                            >
                                <MenuItem value="All">Filter By Service</MenuItem>
                                {uniqueServices.map((service) => (
                                    <MenuItem key={service} value={service} sx={{ fontSize: { xs: "11px", sm: "13px", md: "15px" } }}>
                                        {service}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>

                        {/* Table Component */}
                        <RequestTabSection
                            title="Transactions & Payment History"
                            headers={transactionsPaymentHistoryTableHeaders}
                            data={filteredData}
                            type="1"
                        />
                    </>
                )}
                {tabValue === 1 && (
                    <>
                        <Typography variant="h6" fontWeight="bold"  mb={1}>
                            Payment Settings
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" mb={1}>
                            Configurable Payment Methods
                        </Typography>
                        < PaymentMethodForm />
                    </>
                )}
            </Paper>
        </>
    )
}